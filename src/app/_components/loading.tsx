"use client";

import { Spinner } from "@primer/react";

export default function AppLoader() {
  return (
    <section className="w-full h-full flex items-center justify-center">
      <Spinner />
    </section>
  );
}
