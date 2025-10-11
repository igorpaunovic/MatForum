// src/components/features/questions/CreateQuestionForm.tsx
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateQuestion } from '@/hooks/use-create-question.ts'

const QuestionForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  })
  const { mutate: createQuestion, isPending } = useCreateQuestion()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Convert tags string to array
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag)

    createQuestion({
      createdByUserId: "550e8400-e29b-41d4-a716-446655440010",
      title: formData.title,
      content: formData.content,
      tags: tags
    }, {
      onSuccess: () => {
        navigate({ to: '/questions' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-medium">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Be specific and concise"
          className="h-12 text-base focus:ring-2 focus:ring-blue-500/30"
          required
        />
        <p className="text-xs text-gray-500 italic">
          A good title helps others find your question
        </p>
      </div>

      {/* Content Field */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-base font-medium">Content</Label>
        <div className="border rounded-md focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500">
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Explain your question in detail"
            className="w-full min-h-[240px] p-4 border-0 rounded-md focus:ring-0 resize-y"
            required
          />
        </div>
        <p className="text-xs text-gray-500 italic">
          Include all the information someone would need to answer your question
        </p>
      </div>

      {/* Tags Field */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-base font-medium">Tags</Label>
        <Input
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g. javascript, react, hooks (comma separated)"
          className="h-12 text-base focus:ring-2 focus:ring-blue-500/30"
        />
        <p className="text-xs text-gray-500 italic">
          Add up to 5 tags to categorize your question
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <Button
          variant="outline"
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 h-auto font-medium"
        >
          Post Question
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: '/questions' })}
          className="px-6 py-2.5 h-auto font-medium"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default QuestionForm