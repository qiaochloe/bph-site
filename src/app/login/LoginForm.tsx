"use client"
import { useState } from "react";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { login, logout } from "~/app/actions/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

export function LoginForm() {
  const formSchema = z.object({
    username: z.string().max(50),
    password: z.string().max(50),
    })

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        username: "",
        password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const result = await login(data.username, data.password);
    if (result.error) { 
        setError(result.error); 
    } else { 
        // TODO: would be nice if we can update the page using hooks rather than refreshing 
        router.refresh();
        setError(null); 
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export function LogoutForm() {
  return (
    <Button onClick={() => logout()}>Logout</Button>
  );
}