# HTML Responses - Quick Reference

## Basic Template

```json
{
  "messageType": "text",
  "content": {
    "text": "<div class='space-y-3'>YOUR HTML HERE</div>"
  }
}
```

## Common Patterns

### 1. Feature List with Icons
```html
<ul class='space-y-2 list-none'>
  <li>✅ <strong>Feature:</strong> Description</li>
  <li>✅ <strong>Feature:</strong> Description</li>
</ul>
```

### 2. Colored Info Box
```html
<div class='bg-teal-50 border-l-4 border-teal-500 p-4 rounded'>
  <p class='font-semibold text-teal-900 mb-2'>💡 Title</p>
  <p class='text-teal-800'>Content here</p>
</div>
```

### 3. Price Highlight
```html
<p>Starting at <span class='font-bold text-teal-600'>R385/month</span></p>
```

### 4. Simple Table
```html
<table class='w-full text-sm'>
  <tr class='border-b'>
    <th class='text-left py-2'>Column 1</th>
    <th class='text-left py-2'>Column 2</th>
  </tr>
  <tr>
    <td class='py-2'>Data 1</td>
    <td class='py-2'>Data 2</td>
  </tr>
</table>
```

### 5. Comparison Checkmarks
```html
<li class='text-green-600'>✓ Included</li>
<li class='text-red-600'>✗ Not covered</li>
```

## Color Classes

| Plan | Text | Background | Border |
|------|------|------------|--------|
| Day-to-Day | `text-teal-600` | `bg-teal-50` | `border-teal-500` |
| Value Plus | `text-indigo-600` | `bg-indigo-50` | `border-indigo-500` |
| Executive | `text-purple-600` | `bg-purple-50` | `border-purple-500` |
| Platinum | `text-red-600` | `bg-red-50` | `border-red-500` |
| Senior | `text-yellow-600` | `bg-yellow-50` | `border-yellow-500` |

## Spacing Classes

- `space-y-1` - 0.25rem gap
- `space-y-2` - 0.5rem gap
- `space-y-3` - 0.75rem gap
- `space-y-4` - 1rem gap

- `p-2` - 0.5rem padding
- `p-3` - 0.75rem padding
- `p-4` - 1rem padding

- `mb-2` - 0.5rem margin bottom
- `mb-3` - 0.75rem margin bottom
- `mt-3` - 0.75rem margin top

## Text Styles

- `font-semibold` - Semi-bold weight
- `font-bold` - Bold weight
- `text-sm` - Small text (0.875rem)
- `text-lg` - Large text (1.125rem)
- `text-gray-600` - Gray text
- `text-gray-800` - Darker gray

## Common Icons (Emojis)

- ✅ Checkmark (included)
- ✗ X mark (not included)
- 💡 Light bulb (tip)
- 🏥 Hospital
- 👨‍⚕️ Doctor
- 💊 Medicine
- 🦷 Tooth (dental)
- 👁️ Eye (optometry)
- 📞 Phone
- ✉️ Email
- ⚠️ Warning
- ℹ️ Information

## Full Example

```json
{
  "messageType": "text",
  "content": {
    "text": "<div class='space-y-4'><div class='bg-teal-50 border-l-4 border-teal-500 p-4 rounded'><p class='font-semibold text-teal-900 mb-2'>Day-to-Day Plan</p><p class='text-teal-800'>Perfect for everyday medical needs!</p></div><ul class='space-y-2 list-none'><li>✅ <strong>GP Visits:</strong> Unlimited</li><li>✅ <strong>Medication:</strong> Acute prescriptions</li><li>✅ <strong>Dentistry:</strong> Basic care</li></ul><p class='text-sm text-gray-600 mt-3'>From <span class='font-bold text-teal-600'>R385/month</span></p></div>"
  }
}
```

## Tips

1. Always wrap in `<div class='space-y-3'>` for consistent spacing
2. Use `list-none` to remove default bullet points when using emojis
3. Combine `font-bold` with color classes for emphasis
4. Use `border-l-4` for left accent borders
5. Add `rounded` or `rounded-lg` for softer edges
6. Keep mobile-friendly with `w-full` and responsive classes
