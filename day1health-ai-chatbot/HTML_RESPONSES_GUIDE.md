# HTML Responses Guide

The Hugging Face bot now supports HTML formatting in text responses for beautifully designed answers!

## How It Works

When the bot returns a `text` message type, it can now include HTML markup that will be rendered in the chat interface.

## Supported HTML Elements

### Text Formatting
- `<strong>` or `<b>` - Bold text
- `<em>` or `<i>` - Italic text
- `<u>` - Underlined text
- `<mark>` - Highlighted text

### Structure
- `<p>` - Paragraphs
- `<br>` - Line breaks
- `<hr>` - Horizontal rules
- `<div>` - Container blocks
- `<span>` - Inline containers

### Lists
- `<ul>` + `<li>` - Bullet lists
- `<ol>` + `<li>` - Numbered lists

### Headings
- `<h1>` to `<h6>` - Headings (use h3-h5 for best results in chat)

### Styling with Tailwind CSS

You can use Tailwind CSS classes for advanced styling:

```html
<div class="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
  <p class="font-semibold text-lg text-blue-900">Important Information</p>
  <p class="text-blue-800">This is a styled message with Tailwind classes.</p>
</div>
```

## Example Responses

### Simple Formatted Text
```json
{
  "messageType": "text",
  "content": {
    "text": "<p>Welcome to <strong>Day1Health</strong>!</p><p>How can I help you today?</p>"
  }
}
```

### Feature List with Icons
```json
{
  "messageType": "text",
  "content": {
    "text": "<div class='space-y-2'><p class='font-semibold text-lg mb-3'>Plan Benefits:</p><ul class='space-y-2'><li>✅ <strong>Hospital Cover:</strong> Up to R500,000 per year</li><li>✅ <strong>GP Visits:</strong> Unlimited consultations</li><li>✅ <strong>Chronic Medication:</strong> 27 conditions covered</li></ul></div>"
  }
}
```

### Styled Information Box
```json
{
  "messageType": "text",
  "content": {
    "text": "<div class='bg-teal-50 border-l-4 border-teal-500 p-4 rounded'><p class='font-semibold text-teal-900 mb-2'>💡 Pro Tip</p><p class='text-teal-800'>Comprehensive plans offer the best value for families who visit doctors regularly!</p></div>"
  }
}
```

### Comparison Table
```json
{
  "messageType": "text",
  "content": {
    "text": "<div class='space-y-3'><p class='font-semibold text-lg'>Quick Comparison:</p><table class='w-full text-sm'><tr class='border-b'><th class='text-left py-2'>Feature</th><th class='text-left py-2'>Day-to-Day</th><th class='text-left py-2'>Hospital</th></tr><tr class='border-b'><td class='py-2'>GP Visits</td><td class='py-2 text-green-600'>✓ Included</td><td class='py-2 text-red-600'>✗ Not covered</td></tr><tr><td class='py-2'>Hospital Stays</td><td class='py-2 text-red-600'>✗ Not covered</td><td class='py-2 text-green-600'>✓ Included</td></tr></table></div>"
  }
}
```

## Day1Health Color Palette

Use these colors for consistent branding:

- **Teal** (Day-to-Day): `#0D9488` or `text-teal-600`, `bg-teal-50`
- **Indigo** (Value Plus): `#4F46E5` or `text-indigo-600`, `bg-indigo-50`
- **Purple** (Executive): `#7C3AED` or `text-purple-600`, `bg-purple-50`
- **Red** (Platinum): `#DB504A` or `text-red-600`, `bg-red-50`
- **Yellow** (Senior): `#FFCE26` or `text-yellow-600`, `bg-yellow-50`

## Best Practices

1. **Keep it clean** - Don't overuse styling
2. **Use semantic HTML** - Use proper tags for their intended purpose
3. **Mobile-friendly** - Avoid fixed widths, use responsive classes
4. **Accessibility** - Use proper heading hierarchy and alt text
5. **Consistent colors** - Stick to the Day1Health palette
6. **Test thoroughly** - Preview HTML responses before deploying

## Security Note

The HTML is rendered using `dangerouslySetInnerHTML`, which means:
- Only use trusted content
- Never include user-generated HTML without sanitization
- The bot's responses are controlled by the AI model, so ensure proper prompt engineering

## Fallback Behavior

If no HTML tags are detected in the text, it will render as plain text with `whitespace-pre-wrap` for line breaks.
