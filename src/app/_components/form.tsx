"use client";

import { useRef } from "react";
import { createUserAction } from "../actions";

export default function UserForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function action(data: FormData) {
    const name = data.get("name");
    const email = data.get("email");

    if (!name || typeof name !== "string") return;
    if (!email || typeof email !== "string") return;

    await createUserAction({
      name,
      email,
    });

    formRef!.current?.reset();
  }

  return (
    <form ref={formRef} action={action}>
      <div className="flex flex-col">
        <label htmlFor="name" className="text-xs">
          Name
        </label>
        <input
          name="name"
          type="text"
          className="border-b-2 focus:outline-none border-gray-400 px-4 py-3 text-5xl mt-1 mb-3 bg-transparent"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className="text-xs">
          Email Address
        </label>
        <input
          name="email"
          type="text"
          className="border-b-2 focus:outline-none border-gray-400 px-4 py-3 text-5xl mt-1 mb-3 bg-transparent"
        />
      </div>

      <button type="submit" className="mt-5 bg-blue-700 text-white px-4 py-4">
        Create
      </button>
    </form>
  );
}
