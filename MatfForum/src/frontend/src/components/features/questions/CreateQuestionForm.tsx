// src/components/features/questions/QuestionForm.tsx
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateQuestion } from '@/hooks/useCreateQuestion'

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
    // const tagsArray = formData.tags
    //   .split(',')
    //   .map(tag => tag.trim())
    //   .filter(tag => tag)

    createQuestion({
      title: formData.title,
      content: formData.content,
      authorName: 'Unknown User',
      tags: []
    }, {
      onSuccess: () => {
        navigate({ to: '/questions' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Question Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Be specific and concise"
          required
        />
        <p className="text-xs text-gray-500">
          A good title helps others find your question
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Question Details</Label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Explain your question in detail"
          className="w-full min-h-[200px] p-3 border rounded-md"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g. javascript,react,hooks (comma separated)"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Post Question'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: '/questions' })}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default QuestionForm