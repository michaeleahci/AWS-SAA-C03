import http.server
import socketserver
import json
import os

PORT = 8000
DATA_FILE = 'data.json'

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/topics':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    data = f.read()
                    self.wfile.write(data.encode('utf-8'))
            except FileNotFoundError:
                self.wfile.write(b'[]')
        else:
            # Serve static files
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/topics':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                new_topic = json.loads(post_data.decode('utf-8'))
                
                # Read existing data
                try:
                    with open(DATA_FILE, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                except (FileNotFoundError, json.JSONDecodeError):
                    data = []
                
                # Add ID if not present
                if 'id' not in new_topic:
                    # Use English title for ID generation if possible
                    title_base = new_topic.get('title', {}).get('en', 'topic')
                    clean_title = "".join(c if c.isalnum() else "-" for c in title_base).lower()
                    new_topic['id'] = f"custom-{clean_title}-{len(data) + 1}"
                
                data.append(new_topic)
                
                # Write back to file
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=4)
                
                self.send_response(201)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"message": "Topic added successfully", "topic": new_topic}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_PUT(self):
        if self.path.startswith('/api/topics/'):
            topic_id = self.path.split('/')[-1]
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                updated_topic = json.loads(post_data.decode('utf-8'))
                
                # Read existing data
                try:
                    with open(DATA_FILE, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                except (FileNotFoundError, json.JSONDecodeError):
                    data = []
                
                # Find and update
                found = False
                for i, topic in enumerate(data):
                    if topic.get('id') == topic_id:
                        # Preserve ID
                        updated_topic['id'] = topic_id
                        data[i] = updated_topic
                        found = True
                        break
                
                if not found:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(b'{"error": "Topic not found"}')
                    return

                # Write back to file
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=4)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"message": "Topic updated successfully", "topic": updated_topic}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

print(f"Serving at http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    httpd.serve_forever()
