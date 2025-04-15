import { createSignal, Show } from "solid-js"
import type { Role } from "~/types"

export default function MessageAction({
  role,
  edit,
  del,
  copy,
  reAnswer
}: {
  role: Role
  edit: () => void
  del: () => void
  copy: () => void
  reAnswer: () => void
}) {
  const [copied, setCopied] = createSignal(false)
  return (
    <div class="flex absolute items-center justify-between <sm:top--4 <sm:right-0 top-2 right-2 text-sm text-slate-7 dark:text-slate group-hover:opacity-100 group-focus:opacity-100 opacity-0 dark:bg-#292B32 bg-#E7EBF0 rounded">
      <Show when={role === "assistant"}>
        <ActionItem
          label="Copy"
          onClick={() => {
            setCopied(true)
            copy()
            setTimeout(() => setCopied(false), 1000)
          }}
          icon={copied() ? "i-un:copied" : "i-un:copy"}
        />
      </Show>
      <Show when={role === "user"}>
        <ActionItem label="Edit" onClick={edit} icon={"i-carbon:edit"} />
      </Show>
      <ActionItem label="Retry" onClick={reAnswer} icon={"i-carbon:reset"} />
      <ActionItem label="Delete" onClick={del} icon={"i-carbon:trash-can"} />
    </div>
  )
}

function ActionItem(props: { onClick: any; icon: string; label?: string }) {
  return (
    <div
      class="flex items-center cursor-pointer p-2 hover:bg-slate/10 rounded text-1.2em"
      onClick={props.onClick}
      attr:tooltip={props.label}
      attr:position="top"
    >
      <button class={props.icon} title={props.label} />
    </div>
  )
}
