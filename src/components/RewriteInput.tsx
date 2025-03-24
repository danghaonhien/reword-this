import React from 'react'

interface RewriteInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const RewriteInput: React.FC<RewriteInputProps> = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor="text-input" 
        className="block text-sm font-medium mb-1"
      >
        Text to Rewrite
      </label>
      <textarea
        id="text-input"
        value={value}
        onChange={onChange}
        placeholder="Paste or type the text you want to rewrite..."
        className="w-full h-32 p-2 border border-input rounded-md bg-background 
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  )
}

export default RewriteInput 