from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from analyzer.wrapper_detector import WrapperDetector

app = Flask(__name__)
CORS(app)

detector = WrapperDetector()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'notwrapper-analyzer'})

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        print(f'🔍 Analyzing: {url}')
        
        # Run analysis
        result = detector.analyze_url(url)
        
        print(f'✅ Analysis complete: {result["verdict"]} ({result["confidence"]}%)')
        
        return jsonify(result)
        
    except Exception as e:
        print(f'❌ Analysis error: {str(e)}')
        return jsonify({
            'error': 'Analysis failed',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

