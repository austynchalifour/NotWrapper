import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import re
import time

class WrapperDetector:
    """
    Detects wrapper patterns in web applications.
    
    Wrapper indicators:
    - Webflow/Bubble/Wix templates
    - Direct OpenAI API calls from frontend
    - Zapier/Make.com automations
    - Boilerplate SaaS templates
    - Minimal custom code
    """
    
    def __init__(self):
        self.wrapper_patterns = {
            'webflow': [
                'webflow.com',
                'webflow.css',
                'webflow.js',
                'wf-page',
                'w-webflow-badge'
            ],
            'bubble': [
                'bubble.io',
                'bubble.is',
                'bubbleapps.io',
                'bubble-element'
            ],
            'wix': [
                'wix.com',
                'parastorage.com',
                'wixstatic.com'
            ],
            'squarespace': [
                'squarespace.com',
                'sqsp.com',
                'squarespace-cdn.com'
            ],
            'zapier': [
                'zapier.com/hooks',
                'hooks.zapier.com'
            ],
            'make': [
                'make.com/webhook',
                'integromat.com'
            ],
            'openai_direct': [
                'api.openai.com/v1',
                'openai.com/api',
                'sk-[A-Za-z0-9]{48}',  # OpenAI API key pattern
                'Authorization.*Bearer.*sk-'
            ],
            'replicate': [
                'replicate.com/api',
                'api.replicate.com'
            ],
            'boilerplate': [
                'shipfast',
                'fastapi-template',
                'saas-starter',
                'nextjs-boilerplate'
            ]
        }
        
        self.custom_code_indicators = [
            'webpack',
            'vite',
            'esbuild',
            'rollup',
            'custom',
            'api/v1',
            'graphql'
        ]
    
    def analyze_url(self, url):
        """Main analysis function"""
        try:
            # Validate URL
            parsed = urlparse(url)
            if not parsed.scheme:
                url = 'https://' + url
            
            receipts = {
                'detected_frameworks': [],
                'suspicious_patterns': [],
                'api_endpoints_found': [],
                'wrapper_signals': [],
                'custom_code_signals': []
            }
            
            # Fetch page content
            headers = {
                'User-Agent': 'Mozilla/5.0 (compatible; NotWrapperBot/1.0)'
            }
            
            response = requests.get(url, headers=headers, timeout=10, verify=False, allow_redirects=True)
            response.raise_for_status()
            
            html = response.text
            soup = BeautifulSoup(html, 'html.parser')
            
            # Analyze HTML structure
            self._analyze_html(soup, receipts)
            
            # Analyze scripts
            self._analyze_scripts(soup, receipts)
            
            # Analyze stylesheets
            self._analyze_stylesheets(soup, receipts)
            
            # Analyze meta tags
            self._analyze_meta_tags(soup, receipts)
            
            # Calculate verdict and confidence
            verdict, confidence = self._calculate_verdict(receipts)
            
            # Build stack DNA
            stack_dna = self._build_stack_dna(receipts)
            
            return {
                'verdict': verdict,
                'confidence': confidence,
                'receipts': receipts,
                'stack_dna': stack_dna,
                'analysis_data': {
                    'url': url,
                    'status_code': response.status_code,
                    'response_time_ms': int(response.elapsed.total_seconds() * 1000)
                }
            }
            
        except requests.Timeout:
            return self._error_result('Timeout', 'Request timeout')
        except requests.RequestException as e:
            return self._error_result('Connection Error', str(e))
        except Exception as e:
            return self._error_result('Analysis Error', str(e))
    
    def _analyze_html(self, soup, receipts):
        """Analyze HTML structure for wrapper indicators"""
        html_str = str(soup)
        
        # Check for no-code platforms
        for platform, patterns in self.wrapper_patterns.items():
            for pattern in patterns:
                if re.search(pattern, html_str, re.IGNORECASE):
                    receipts['wrapper_signals'].append({
                        'type': platform,
                        'pattern': pattern,
                        'severity': 'high'
                    })
        
        # Check for custom indicators
        for indicator in self.custom_code_indicators:
            if indicator in html_str.lower():
                receipts['custom_code_signals'].append(indicator)
    
    def _analyze_scripts(self, soup, receipts):
        """Analyze JavaScript files"""
        scripts = soup.find_all('script', src=True)
        
        for script in scripts:
            src = script.get('src', '')
            
            # Check for wrapper patterns in script sources
            for platform, patterns in self.wrapper_patterns.items():
                for pattern in patterns:
                    if pattern in src.lower():
                        receipts['wrapper_signals'].append({
                            'type': platform,
                            'pattern': f'Script: {src}',
                            'severity': 'high'
                        })
            
            # Check for custom bundlers
            if any(bundler in src.lower() for bundler in ['webpack', 'vite', 'bundle', 'chunk']):
                receipts['custom_code_signals'].append(f'Custom bundle: {src}')
            
            # Detect frameworks
            if 'react' in src.lower():
                receipts['detected_frameworks'].append('React')
            if 'vue' in src.lower():
                receipts['detected_frameworks'].append('Vue')
            if 'angular' in src.lower():
                receipts['detected_frameworks'].append('Angular')
            if 'next' in src.lower():
                receipts['detected_frameworks'].append('Next.js')
        
        # Analyze inline scripts for API calls
        inline_scripts = soup.find_all('script', src=False)
        for script in inline_scripts:
            script_content = script.string or ''
            
            # Check for direct API keys (huge red flag)
            if re.search(r'sk-[A-Za-z0-9]{48}', script_content):
                receipts['wrapper_signals'].append({
                    'type': 'exposed_api_key',
                    'pattern': 'OpenAI API key in frontend',
                    'severity': 'critical'
                })
            
            # Check for API endpoints
            api_patterns = [
                r'api\.openai\.com',
                r'api\.anthropic\.com',
                r'api\.replicate\.com',
                r'hooks\.zapier\.com',
                r'/api/chat',
                r'/api/generate'
            ]
            
            for pattern in api_patterns:
                matches = re.findall(pattern, script_content, re.IGNORECASE)
                if matches:
                    receipts['api_endpoints_found'].extend(matches)
    
    def _analyze_stylesheets(self, soup, receipts):
        """Analyze CSS files"""
        stylesheets = soup.find_all('link', rel='stylesheet')
        
        for link in stylesheets:
            href = link.get('href', '')
            
            # Check for no-code platform stylesheets
            for platform, patterns in self.wrapper_patterns.items():
                for pattern in patterns:
                    if pattern in href.lower():
                        receipts['wrapper_signals'].append({
                            'type': platform,
                            'pattern': f'Stylesheet: {href}',
                            'severity': 'medium'
                        })
    
    def _analyze_meta_tags(self, soup, receipts):
        """Analyze meta tags"""
        generator = soup.find('meta', attrs={'name': 'generator'})
        if generator:
            content = generator.get('content', '').lower()
            
            if 'webflow' in content:
                receipts['wrapper_signals'].append({
                    'type': 'webflow',
                    'pattern': 'Meta generator tag',
                    'severity': 'high'
                })
            elif 'wix' in content:
                receipts['wrapper_signals'].append({
                    'type': 'wix',
                    'pattern': 'Meta generator tag',
                    'severity': 'high'
                })
            elif 'squarespace' in content:
                receipts['wrapper_signals'].append({
                    'type': 'squarespace',
                    'pattern': 'Meta generator tag',
                    'severity': 'high'
                })
    
    def _calculate_verdict(self, receipts):
        """Calculate final verdict and confidence"""
        wrapper_score = 0
        custom_score = 0
        
        # Count wrapper signals
        for signal in receipts['wrapper_signals']:
            if signal['severity'] == 'critical':
                wrapper_score += 30
            elif signal['severity'] == 'high':
                wrapper_score += 20
            elif signal['severity'] == 'medium':
                wrapper_score += 10
        
        # Count custom code signals
        custom_score += len(receipts['custom_code_signals']) * 10
        custom_score += len(receipts['detected_frameworks']) * 15
        
        # Adjust for API endpoints
        if receipts['api_endpoints_found']:
            # Having API endpoints is neutral - could be custom backend or wrapper
            if len(receipts['api_endpoints_found']) > 3:
                custom_score += 10
        
        # Calculate final scores
        total_signals = wrapper_score + custom_score
        
        if total_signals == 0:
            # No clear signals - suspicious
            return 'Wrapper Sus', 50
        
        wrapper_percentage = wrapper_score / (total_signals) if total_signals > 0 else 0
        
        # Determine verdict
        if wrapper_percentage > 0.7 or wrapper_score > 50:
            verdict = 'Wrapper Confirmed'
            confidence = min(95, 60 + wrapper_score)
        elif wrapper_percentage > 0.4 or (wrapper_score > 0 and custom_score < 20):
            verdict = 'Wrapper Sus'
            confidence = min(85, 50 + wrapper_score)
        else:
            verdict = 'NotWrapper'
            confidence = min(95, 60 + custom_score)
        
        return verdict, confidence
    
    def _build_stack_dna(self, receipts):
        """Build technology stack profile"""
        frameworks = list(set(receipts['detected_frameworks']))
        
        # Detect backend indicators
        backend = 'Unknown'
        if any('node' in sig.lower() for sig in receipts['custom_code_signals']):
            backend = 'Node.js'
        elif any('python' in sig.lower() for sig in receipts['custom_code_signals']):
            backend = 'Python'
        
        # Detect frontend
        frontend = 'Unknown'
        if 'React' in frameworks or 'Next.js' in frameworks:
            frontend = 'React'
        elif 'Vue' in frameworks:
            frontend = 'Vue'
        elif 'Angular' in frameworks:
            frontend = 'Angular'
        
        # Check if custom ML/AI
        has_custom_ml = len(receipts['wrapper_signals']) == 0 and len(receipts['custom_code_signals']) > 3
        
        return {
            'frontend': frontend,
            'backend': backend,
            'frameworks': frameworks,
            'has_custom_ml': has_custom_ml,
            'wrapper_platforms': list(set([s['type'] for s in receipts['wrapper_signals']]))
        }
    
    def _error_result(self, error_type, message):
        """Return error result"""
        return {
            'verdict': 'Wrapper Sus',
            'confidence': 30,
            'receipts': {
                'error': error_type,
                'message': message,
                'detected_frameworks': [],
                'suspicious_patterns': [],
                'api_endpoints_found': [],
                'wrapper_signals': [],
                'custom_code_signals': []
            },
            'stack_dna': {
                'frontend': 'Unknown',
                'backend': 'Unknown',
                'has_custom_ml': False
            },
            'analysis_data': {
                'error': message
            }
        }

