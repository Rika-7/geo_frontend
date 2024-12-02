'use client'

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from 'next/image'

const formSchema = z.object({
  jleagueId: z.string().min(1, { message: "JリーグIDを入力してください" }),
  password: z.string().min(6, { message: "パスワードは6文字以上で入力してください" }),
})

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jleagueId: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
    console.log(values)
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <main className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold">町田GIONスタジアムへ</h1>
          <h2 className="text-lg mt-2">いざ登城！</h2>
        </div>

        <div className="relative w-full max-w-md h-48 mx-auto">
          <Image
            src="/images/castle.png"
            alt="castle"
            fill
            className="rounded-lg"
            priority
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
            <FormField
              control={form.control}
              name="jleagueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">JリーグID</FormLabel>
                  <FormControl>
                    <Input placeholder="JリーグIDを入力" {...field} className="bg-white text-black" />
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
                  <FormLabel className="text-white">パスワード</FormLabel>
                  <FormControl>
                    <Input placeholder="パスワードを入力" type="password" {...field} className="bg-white text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#FF6E7F] hover:bg-[#FF5C6F] text-white">
              ログイン
            </Button>
          </form>
        </Form>
      </main>
    </div>
  )
}

