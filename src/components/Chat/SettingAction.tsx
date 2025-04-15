import { toBlob, toJpeg } from "html-to-image"
import { Match, Show, Switch, type JSXElement } from "solid-js"
import { createStore } from "solid-js/store"
import { defaultEnv } from "~/env"
import { clickOutside } from "~/hooks"
import { RootStore, loadSession } from "~/store"
import type { ChatMessage, SimpleModel } from "~/types"
import {
  copyToClipboard,
  dateFormat,
  delSession,
  generateId,
  getSession,
  isMobile,
  setSession
} from "~/utils"
import { Selector, Switch as SwitchButton } from "../Common"
import { useNavigate } from "@solidjs/router"

export const [actionState, setActionState] = createStore({
  showSetting: "none" as "none" | "global" | "session",
  success: false as false | "markdown" | "link",
  genImg: "normal" as ImgStatusUnion,
  fakeRole: "normal" as FakeRoleUnion,
  clearSessionConfirm: false,
  deleteSessionConfirm: false
})

type ImgStatusUnion = "normal" | "loading" | "success" | "error"
const imgIcons: Record<ImgStatusUnion, string> = {
  success: "i-carbon:status-resolved dark:text-yellow text-yellow-6",
  normal: "i-carbon:image",
  loading: "i-ri:loader-2-line animate-spin",
  error: "i-carbon:warning-alt text-red-6 dark:text-red"
}

export type FakeRoleUnion = "assistant" | "user" | "normal"
const roleIcons: Record<FakeRoleUnion, string> = {
  assistant: "i-ri:android-fill bg-gradient-to-r from-yellow-300 to-red-700 ",
  normal: "i-ri:user-3-line",
  user: "i-ri:user-3-fill bg-gradient-to-r from-red-300 to-blue-700 "
}

export default function SettingAction() {
  const { store, setStore } = RootStore
  const navigator = useNavigate()
  function clearSession() {
    setStore("messageList", messages =>
      messages.filter(k => k.type === "locked")
    )
  }

  // tree shaking
  clickOutside
  return (
    <div
      class="text-sm text-slate-7 dark:text-slate my-2"
      use:clickOutside={() => {
        setActionState("showSetting", "none")
      }}
    >
      <Switch>
        <Match when={actionState.showSetting === "global"}>
          <div class="<sm:max-h-10em max-h-14em overflow-y-auto">
            <SettingItem icon="i-ri:lock-password-line" label="Website Access Password">
              <input
                type="password"
                value={store.globalSettings.password}
                class="input-box"
                onInput={e => {
                  setStore(
                    "globalSettings",
                    "password",
                    (e.target as HTMLInputElement).value
                  )
                }}
              />
            </SettingItem>
            <SettingItem icon="i-carbon:api" label="OpenAI Key">
              <input
                type="password"
                value={store.globalSettings.APIKey}
                class="input-box"
                onInput={e => {
                  setStore(
                    "globalSettings",
                    "APIKey",
                    (e.target as HTMLInputElement).value
                  )
                }}
              />
            </SettingItem>
            <SettingItem icon="i-carbon:keyboard" label="Press Enter to Send">
              <SwitchButton
                checked={store.globalSettings.enterToSend}
                onChange={e => {
                  setStore(
                    "globalSettings",
                    "enterToSend",
                    (e.target as HTMLInputElement).checked
                  )
                }}
              />
            </SettingItem>
          </div>
          <hr class="my-1 bg-slate-5 bg-op-15 border-none h-1px" />
        </Match>
        <Match when={actionState.showSetting === "session"}>
          <div class="<sm:max-h-10em max-h-14em overflow-y-auto">
            <Show when={store.sessionId !== "index"}>
              <SettingItem icon="i-carbon:text-annotation-toggle" label="Conversation Title">
                <input
                  type="text"
                  value={store.sessionSettings.title}
                  class="input-box text-ellipsis"
                  onInput={e => {
                    setStore(
                      "sessionSettings",
                      "title",
                      (e.target as HTMLInputElement).value
                    )
                  }}
                />
              </SettingItem>
            </Show>
            <SettingItem icon="i-carbon:machine-learning-model" label="OpenAI Model">
              <Selector
                class="max-w-150px"
                value={store.sessionSettings.model}
                onChange={e => {
                  setStore(
                    "sessionSettings",
                    "model",
                    (e.target as HTMLSelectElement).value as SimpleModel
                  )
                }}
                options={[
                  {
                    value: "gpt-4o-mini",
                    label: "gpt-4o-mini"
                  },
                  {
                    value: "gpt-4o",
                    label: "gpt-4o"
                  }
                ]}
              />
            </SettingItem>
            <SettingItem icon="i-carbon:data-enrichment" label="Creativity Level">
              <div class="flex items-center justify-between w-150px">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={String(store.sessionSettings.APITemperature * 50)}
                  class="bg-slate max-w-100px w-full h-2 bg-op-15 rounded-lg appearance-none cursor-pointer accent-slate"
                  onInput={e => {
                    setStore(
                      "sessionSettings",
                      "APITemperature",
                      Number((e.target as HTMLInputElement).value) / 50
                    )
                  }}
                />
                <span class="bg-slate bg-op-15 rounded-sm px-1 text-10px">
                  {store.sessionSettings.APITemperature.toFixed(2)}
                </span>
              </div>
            </SettingItem>
            <SettingItem icon="i-carbon:save-image" label="Save Conversation">
              <SwitchButton
                checked={store.sessionSettings.saveSession}
                onChange={e => {
                  setStore(
                    "sessionSettings",
                    "saveSession",
                    (e.target as HTMLInputElement).checked
                  )
                }}
              />
            </SettingItem>
            <SettingItem icon="i-carbon:3d-curve-auto-colon" label="Enable Continuous Dialogue">
              <SwitchButton
                checked={store.sessionSettings.continuousDialogue}
                onChange={e => {
                  setStore(
                    "sessionSettings",
                    "continuousDialogue",
                    (e.target as HTMLInputElement).checked
                  )
                }}
              />
            </SettingItem>
          </div>
          <hr class="my-1 bg-slate-5 bg-op-15 border-none h-1px" />
        </Match>
      </Switch>
    </div>
  )
}

function SettingItem(props: {
  children: JSXElement
  icon: string
  label: string
}) {
  return (
    <div class="flex items-center p-1 justify-between hover:bg-slate hover:bg-op-10 rounded">
      <div class="flex items-center">
        <button class={props.icon} />
        <span class="ml-1">{props.label}</span>
      </div>
      {props.children}
    </div>
  )
}

function ActionItem(props: { onClick: any; icon: string; label?: string }) {
  return (
    <div
      class="flex items-center cursor-pointer mx-1 p-2 hover:(dark:bg-#23252A bg-#ECF0F4) rounded text-1.2em"
      onClick={props.onClick}
      attr:tooltip={props.label}
      attr:position="top"
    >
      <button class={props.icon} title={props.label} />
    </div>
  )
}
