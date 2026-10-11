<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Load sitewide ad verification scripts through the root route head configuration so every content page includes them once.

- Render responsive AdSense units in the shared AdBanner component, initialize each once after it has width, and keep the provider script only in the root head to avoid duplicate loads.
