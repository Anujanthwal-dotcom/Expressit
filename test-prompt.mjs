import { multiselect } from '@clack/prompts'

const result = await multiselect({
  message: 'test',
  required: false,
  options: [
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'postgresql', label: 'PostgreSQL' },
  ],
})

console.log('Result type:', typeof result)
console.log('Result:', result)
console.log('Is array:', Array.isArray(result))
if (Array.isArray(result)) {
  console.log('Length:', result.length)
  console.log('Values:', result)
}
