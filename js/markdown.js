// Simple Markdown to HTML converter
class MarkdownConverter {
    constructor() {
        this.rules = [
            // Headers
            { pattern: /^### (.*$)/gim, replacement: '<h3>$1</h3>' },
            { pattern: /^## (.*$)/gim, replacement: '<h2>$1</h2>' },
            { pattern: /^# (.*$)/gim, replacement: '<h1>$1</h1>' },
            
            // Bold and Italic
            { pattern: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em>$1</em></strong>' },
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
            { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
            
            // Code blocks
            { pattern: /```([\s\S]*?)```/g, replacement: '<pre><code>$1</code></pre>' },
            { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' },
            
            // Links
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" target="_blank">$1</a>' },
            
            // Images
            { pattern: /!\[([^\]]*)\]\(([^)]+)\)/g, replacement: '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">' },
            
            // Lists
            { pattern: /^\* (.*$)/gim, replacement: '<li>$1</li>' },
            { pattern: /^- (.*$)/gim, replacement: '<li>$1</li>' },
            { pattern: /^\d+\. (.*$)/gim, replacement: '<li>$1</li>' },
            
            // Blockquotes
            { pattern: /^> (.*$)/gim, replacement: '<blockquote>$1</blockquote>' },
            
            // Horizontal rules
            { pattern: /^---$/gim, replacement: '<hr>' },
            
            // Line breaks
            { pattern: /\n\n/g, replacement: '</p><p>' },
        ];
    }
    
    convert(markdown) {
        if (!markdown) return '';
        
        // Wrap in paragraph tags
        let html = '<p>' + markdown + '</p>';
        
        // Apply conversion rules
        this.rules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replacement);
        });
        
        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p><\/p>/g, '');
        
        // Wrap lists properly
        html = this.wrapLists(html);
        
        return html;
    }
    
    wrapLists(html) {
        // Find consecutive list items and wrap them in ul/ol tags
        const listItemPattern = /<li>.*?<\/li>/g;
        const listItems = html.match(listItemPattern);
        
        if (listItems) {
            let currentList = '';
            let inList = false;
            let result = '';
            
            const lines = html.split('\n');
            
            for (let line of lines) {
                if (line.includes('<li>')) {
                    if (!inList) {
                        currentList = '<ul>';
                        inList = true;
                    }
                    currentList += line;
                } else {
                    if (inList) {
                        currentList += '</ul>';
                        result += currentList;
                        currentList = '';
                        inList = false;
                    }
                    result += line;
                }
            }
            
            if (inList) {
                currentList += '</ul>';
                result += currentList;
            }
            
            return result;
        }
        
        return html;
    }
    
    // Convert a single line of markdown
    convertLine(line) {
        let result = line;
        
        // Apply inline formatting
        result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
        result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
        result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        return result;
    }
}

// Create global instance
window.markdownConverter = new MarkdownConverter();

// Utility function to convert markdown to HTML
function markdownToHtml(markdown) {
    return window.markdownConverter.convert(markdown);
}

// Export for use in other files
window.markdownUtils = {
    markdownToHtml,
    MarkdownConverter
}; 