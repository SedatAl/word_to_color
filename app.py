from flask import Flask, render_template, request, jsonify
from color_generator import sentence_to_distinct_colors

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    sentence = request.form.get('sentence', '')
    if not sentence:
        return jsonify({'error': 'Please enter a sentence'})
    
    words = sentence.strip().split()
    colors = sentence_to_distinct_colors(sentence)
    
    result = {
        'sentence': sentence,
        'colors': [
            {
                'word': word,
                'rgb': color,  # This is already a tuple (r,g,b)
                'hex': '#{:02x}{:02x}{:02x}'.format(*color),
                'text_color': 'white' if sum(color) < 380 else 'black'
            }
            for word, color in zip(words, colors)
        ]
    }
    
    print("Generated result:", result)  # Debug print
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True) 