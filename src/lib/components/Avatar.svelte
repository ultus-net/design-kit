<script lang="ts">
  type Size = 'sm' | 'md' | 'lg';
  type Props = { name: string; size?: Size } & ({ src: string; alt: string } | { src?: undefined; alt?: undefined });

  let { name, src, alt, size = 'md' }: Props = $props();

  const displayName = $derived(name.trim().replace(/\s+/g, ' '));
  // A part contributes an initial only if it carries a letter or a digit, so a
  // punctuation-only name falls through to the decorative rendering.
  const words = $derived(
    displayName
      .split(' ')
      .flatMap((word) => word.split('-'))
      .filter((word) => /[\p{L}\p{N}]/u.test(word))
  );
  const initials = $derived.by(() => {
    if (words.length === 0) return '';
    const first = words[0].charAt(0);
    const last = words[words.length - 1].charAt(0);
    return (words.length === 1 ? first : first + last).toUpperCase();
  });
</script>

{#if src}
  <img class="fw-avatar fw-avatar--{size}" {src} {alt} />
{:else}
  <span
    class="fw-avatar fw-avatar--{size} fw-avatar--initials"
    role={initials ? 'img' : undefined}
    aria-label={initials ? displayName : undefined}
    aria-hidden={initials ? undefined : 'true'}
  >{initials}</span>
{/if}

<style>
  .fw-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: var(--fw-radius-pill);
    background: var(--fw-sunken);
    color: var(--fw-text);
    font-family: var(--fw-font-body);
    font-weight: var(--fw-weight-semibold);
    object-fit: cover;
  }

  .fw-avatar--sm {
    inline-size: var(--fw-space-6);
    block-size: var(--fw-space-6);
    font-size: var(--fw-font-size-body-xxs);
  }

  .fw-avatar--md {
    inline-size: var(--fw-space-8);
    block-size: var(--fw-space-8);
    font-size: var(--fw-font-size-body-xs);
  }

  .fw-avatar--lg {
    inline-size: var(--fw-space-10);
    block-size: var(--fw-space-10);
    font-size: var(--fw-font-size-body-s);
  }
</style>
