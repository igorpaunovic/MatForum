import {
    useIsMutating,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query"
  import { useNavigate } from "@tanstack/react-router"
  import { toast } from "sonner"
  import {
    sanitizeRedirect,
    usePreviousLocation,
  } from "@/components/hooks/usePreviousLocation"
import { useAppForm } from "@/features/claims/components/form/index"
import { SignInSchema } from "@/shared/schemas/auth-schema"
//import { authClient } from "~/lib/auth/client"
import { dfLogin, type AuthResponse } from "@/shared/auth/services/auth"   // see df.ts from earlier
import { authOptions } from "@/shared/auth/api/auth-query"


  // instead of calling authClient i should call like useAuth hook inside what i have signIn method that puts email and password 
  // because my login is like on DF server and i hit this endpoint 
  
  export const SignInForm = ({ redirectTo }: { redirectTo?: string }) => {
    const previousLocation = usePreviousLocation()
    const isAuthLoading = useIsMutating({ mutationKey: ["auth"] }) > 0
  
    const navigate = useNavigate()
    const queryClient = useQueryClient()
  
    // const signInMutation = useMutation({
    //   mutationKey: ["auth", "sign-in"],
    //   mutationFn: signIn,   
    //   onSuccess: (response) => {
    //     toast.success(`Hey ${response.user.name}, welcome back!`)
  
    //     queryClient.resetQueries()
    //     const target = sanitizeRedirect(redirectTo ?? previousLocation)
    //     navigate({ to: target })
    //   },
    // })
    const signInMutation = useMutation({
        mutationKey: ["auth", "sign-in"],
        mutationFn: async (data: SignInSchema) => {
          // DF expects { username, password }
          const res = await dfLogin(data.email, data.password) // stores token internally
          const opts = authOptions()
          
          // Seed auth cache so protected loaders pass immediately
          queryClient.setQueryData(opts.queryKey, res)
          return res
        },
        onSuccess: (res: AuthResponse) => {
          //toast.success(`Hey ${res.name}, welcome back!`)
          toast.success(`Uspešno ste se prijavili! Dobrošao ${res.name}`)
          // queryClient.invalidateQueries()
          const target = sanitizeRedirect(redirectTo ?? previousLocation, '/claims')
          navigate({ to: target , replace: true})
        },
      })
  
    const form = useAppForm({
      defaultValues: {
        email: import.meta.env.VITE_DEFAULT_USER_EMAIL ?? "",
        password: import.meta.env.VITE_DEFAULT_USER_PASSWORD ?? "",
      } as SignInSchema,
      onSubmit: async ({ value }) => {
        // await signInMutation.mutateAsync(value)
        await signInMutation.mutateAsync({ email: value.email, password: value.password })
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
        <form.AppField
          name="password"
          children={(field) => (
            <field.TextField
              label="Password"
              required
              type="password"
              autoComplete="current-password"
              withPasswordToggle
            />
          )}
        />
        <form.AppForm>
          <form.SubmitButton
            label="Sign in"
            className="w-full mt-2"
            disabled={isAuthLoading}
          />
        </form.AppForm>
      </form>
    )
  }