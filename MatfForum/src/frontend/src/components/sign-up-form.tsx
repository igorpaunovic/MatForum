import {
    useIsMutating,
    useMutation,
    // useQueryClient,
  } from "@tanstack/react-query"
  import { useNavigate } from "@tanstack/react-router"
  import { toast } from "sonner"
  import {
    sanitizeRedirect,
    usePreviousLocation,
  } from "@/components/hooks/usePreviousLocation"
  import { useAppForm } from "@/features/claims/components/form/index"
  import { SignUpSchema } from "@/shared/schemas/auth-schema"
  import { z } from "zod"
  import { dfSignUp } from "@/shared/auth/services/auth"

  // import { authClient } from "~/lib/auth/client" // nije napisano fali 
  
//   const signUp = async (data: SignUpSchema) => {
//     // ovo treba da se razmisli kako da se napise 
//     const { error } = await authClient.signUp.email({  
//       email: data.email,
//       // password: data.password,
//       // name: data.username,
//     })
  
//     if (error) {
//       throw new Error(error.message)
//     }
  
//     return data
//   }
const SignUpEmailSchema = z.object({ email: z.string().email() })
type SignUpEmail = z.infer<typeof SignUpEmailSchema>

  
  export const SignUpForm = ({ redirectTo }: { redirectTo?: string }) => {
    // const queryClient = useQueryClient()
    const isAuthLoading = useIsMutating({ mutationKey: ["auth"] }) > 0
    const navigate = useNavigate()
    const previousLocation = usePreviousLocation()
    

    // da li ovo treba da bude ovde ili sve moze da se izmesti u 1 veliki hook 
    // const signUpMutation = useMutation({
    //   mutationKey: ["auth", "sign-up"],
    //   mutationFn: signUp,
    //   onSuccess: () => {
    //     toast.success("You have successfully signed up.")
    //     queryClient.resetQueries()
    //     const target = sanitizeRedirect(redirectTo ?? previousLocation)
    //     navigate({ to: target })
    //   },
    // })
    const signUpMutation = useMutation({
        mutationKey: ["auth", "sign-up"],
        mutationFn: async (data: SignUpEmail) => {
          SignUpEmailSchema.parse(data)
          const res = await dfSignUp(data.email)
          return res
        },
        onSuccess: () => {
          toast.success("Check your email/SMS for the verification key.")
          const target = sanitizeRedirect(redirectTo ?? previousLocation) || "/"
          // Go to verify screen; pass along redirect target
          navigate({ to: "/verify-email", search: { redirectTo: target } })
        },
        onError: (e: unknown) => {
          toast.error((e as Error).message || "Sign-up failed")
        },
      })

    const form = useAppForm({
      defaultValues: {
        email: "test@test.com",
        // email: "",
        // password: "",
        // confirmPassword: "",
      } as SignUpSchema,
      onSubmit: async ({ value }) => {
        await signUpMutation.mutateAsync(value)
      },
    })
  
    return (
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        {/* <form.AppField
          name="username"
          children={(field) => (
            <field.TextField
              label="Username"
              required
              placeholder="Your display name"
              autoComplete="username"
            />
          )}
        /> */}
        <form.AppField
          name="email"
          children={(field) => (
            <field.TextField
              label="Email"
              required
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          )}
        />
        {/* <form.AppField
          name="password"
          children={(field) => (
            <field.TextField
              label="Password"
              required
              type="password"
              autoComplete="new-password"
              helpText="Use at least 8 characters."
              withPasswordToggle
            />
          )}
        /> */}
        {/* <form.AppField
          name="confirmPassword"
          children={(field) => (
            <field.TextField
              label="Confirm Password"
              required
              type="password"
              autoComplete="new-password"
              withPasswordToggle
            />
          )}
        /> */}
        <form.AppForm>
          <form.SubmitButton
            label="Create account"
            className="w-full mt-2"
            disabled={isAuthLoading}
          />
        </form.AppForm>
      </form>
    )
  }