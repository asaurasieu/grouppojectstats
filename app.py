from flask import Flask, jsonify, request, session, send_from_directory
from database_endpoint import list_available_documents, get_document_content,load_and_process_document, load_paragraph_dict_from_file
from keywords import search_for_query, populate_keywords_to_chunks_index
import openai
from datetime import datetime
import logging
from flask import send_file
import os
from graphviz import Digraph
import csv
from dotenv import load_dotenv
import json
from flask_cors import CORS


app = Flask(__name__, static_folder='interactions')
CORS(app)
app.secret_key = 'debatechatbot'  

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to the API!'})

@app.route('/documents', methods=['GET'])
def list_documents():
    """Endpoint to list available documents."""
    docs = list_available_documents()
    return jsonify({'documents': docs})

@app.route('/documents/<string:document_name>', methods=['GET'])
def get_document(document_name):
    # List available documents to check if the requested document exists
    available_docs = list_available_documents()

    # Check if the document_name exists in the available documents
    if document_name in available_docs:
        # Try to load processed content from the file
        processed_content = load_paragraph_dict_from_file(document_name)
        if processed_content is None:  # If the content is not processed, process it now
            content = get_document_content(document_name)
            processed_content = load_and_process_document(content, document_name)
        return jsonify(processed_content)
    else:
        return jsonify({'error': 'Document not found.'}), 404


@app.route('/', defaults={'path': ''}, methods=['GET'])
@app.route('/<path:path>', methods=['GET'])
def catch_all(path):
    if path == 'documents':
        return list_available_documents()
    else:
        return jsonify({'message': 'Please access the /documents endpoint for the available documents.'})

logging.basicConfig(level=logging.INFO)

    
@app.route('/ask', methods=['POST'])
def ask_question():
    user_input = request.json.get('user_input', '')
    if not user_input:
        logging.error("No user input received")
        return jsonify({'error': 'User input is required.'}), 400
    
    logging.info("Received user input for query: %s", user_input)
    
     # Start the session log if it doesn't exist
    if 'conversation_log' not in session:
        session['conversation_log'] = []   
    
    matched_content = search_for_query(user_input)
    print("Matched content found for the query: ", matched_content)
    
    # Check if matched_content is not empty
    if matched_content:
        # Directly access 'chunk' and 'keywords' from matched_content
        chunk = matched_content['chunk']
        keywords = matched_content['keywords']
        context = f"\n{chunk}\nKeywords: {', '.join(keywords)}"
    else:
        # Handle case where no content is matched
        context = "No content matched the query."
              
    conversation = [
        {"role": "system", "content": "You are a knowledgeable assistant that provides information based on specific document content and keywords."},
        {"role": "user", "content": user_input},
        {"role": "assistant", "content": context}
    ]
    
    response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=conversation,
    temperature=0.7,
    max_tokens=4500
)
    
    generated_response = response.choices[0].message['content'].strip()
    # Append the current interaction to the session log
    session['conversation_log'].append((user_input, generated_response))
    session.modified = True  # Ensure the session is marked as modified
    logging.info("Response from OpenAI API received")
    generate_conversation_flow(session['conversation_log'], 'interactions/conversation_flow.png')
    return jsonify({'answer': generated_response, 'conversation_saved': True})
    
def generate_conversation_flow(conversation_log, output_folder):
    # Generate a timestamped file name
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"conversation_flow_{timestamp}.png"
    output_path = os.path.join(output_folder, filename)
    
    dot = Digraph(comment='Conversation Flow')
    prev_node = None
    for i, (user_input, bot_response) in enumerate(conversation_log):
        user_node = f'User_{i}'
        bot_node = f'Bot_{i}'
        dot.node(user_node, f'User: {user_input}')
        dot.node(bot_node, f'Robo: {bot_response}')
        if prev_node:
            dot.edge(prev_node, user_node)        
        dot.edge(user_node, bot_node)
        prev_node = bot_node
    
    # Save the diagram to the specified path
    dot.render(output_path, format='png', cleanup=True)
    logging.info(f"Conversation flow diagram saved to {output_path}")
        
    
@app.route('/search')
def search():
    query = request.args.get('query', '')
    if not query:
        logging.warning("Search query was empty")
        return jsonify({'error': 'Query is required.'}), 400

    matched_content = search_for_query(query)
    
   
    if matched_content:
        logging.info(f"Matched content found for the query: {query}")
        # Create a response structure based on the matched content
        enriched_response = {
            'document_name': matched_content['document_name'],
            'index': matched_content['chunk_index'],
            'chunk': matched_content['chunk'],
            'keywords': matched_content['keywords'],
            'score': matched_content.get('score', 0)  
        }
    else:
        logging.info("No matched content found for the query.")
        enriched_response = {}

    return jsonify({'match': enriched_response})

   
if __name__ == '__main__':
    load_dotenv()  
    openai.api_key = os.getenv('OPENAI_API_KEY') 
    populate_keywords_to_chunks_index() 
    logging.basicConfig(level=logging.INFO)
    app.run(debug=True, port=5000)