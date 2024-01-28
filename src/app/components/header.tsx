"use client";

import { Button } from "@carbon/react";
import { supabaseClient } from "../lib/supabase";

export default function Header() {
  return (
    <nav>
      <Button
        kind="secondary"
        onClick={async () => {
          await supabaseClient.auth.signOut();
        }}
      >
        Sign Out
      </Button>
    </nav>
  );
}
