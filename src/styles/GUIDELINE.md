## Hướng dẫn sử dụng `global.css`

### Cách hoạt động cơ bản

File này khai báo tokens trong `@theme {}`, Tailwind v4 tự động sinh ra utility classes tương ứng.

```
--color-brand-accent  →  bg-brand-accent, text-brand-accent, border-brand-accent
--spacing-3           →  p-3, m-3, gap-3, px-3, py-3, ...
--radius-pill         →  rounded-pill
--shadow-card         →  shadow-card
--text-h1             →  text-h1
--breakpoint-md       →  md: prefix
```

Một dòng khai báo → vừa có CSS variable (dùng trong `<style scoped>`), vừa có utility class (dùng trong template).

---

### Quy tắc 5 giây

1. **Page background đã là cream** — không cần `bg-*` ở root component
2. **Body text đã là `rgba(0,0,0,0.87)`** — không cần `text-text` ở mọi đoạn văn
3. **Font đã là SoDoSans** — không cần `font-sans` ở mọi nơi
4. **Mặc định khi viết HTML thuần đã đúng brand** — chỉ override khi cần khác

---

### Ví dụ 1: Button — 3 loại CTA chính

```vue
<template>
  <!-- Primary filled -->
  <button class="btn-pill bg-brand-accent text-surface-white border border-brand-accent">
    Explore our menu
  </button>

  <!-- Outlined -->
  <button class="btn-pill bg-transparent text-brand-accent border border-brand-accent">
    Start an order
  </button>

  <!-- Black join CTA -->
  <button class="btn-pill bg-surface-black text-surface-white text-sm">
    Join now
  </button>
</template>
```

`btn-pill` là class component đã định nghĩa sẵn — có sẵn radius pill, padding, weight, transition và `scale(0.95)` khi active. Bạn chỉ cần thêm color.

---

### Ví dụ 2: Heading — dùng HTML thuần

```vue
<template>
  <!-- H1 đã tự động: 24px, semibold, màu Starbucks Green -->
  <h1>Welcome to Starbucks</h1>

  <!-- H2 đã tự động: 24px, normal weight, text black -->
  <h2>Featured this month</h2>

  <!-- H3 đã tự động: 19px, semibold -->
  <h3>Spring menu</h3>
</template>
```

Không cần class. Khi cần override màu (ví dụ trên dark band):

```vue
<section class="bg-brand-house p-6">
  <!-- Override màu trắng vì nền tối -->
  <h1 class="text-text-white">On dark green band</h1>
</section>
```

---

### Ví dụ 3: Content card

```vue
<template>
  <!-- Cách 1: dùng class component có sẵn -->
  <article class="card-content">
    <h3>Cold Brew</h3>
    <p class="text-text-soft text-sm">Slow-steeped for 20 hours.</p>
  </article>

  <!-- Cách 2: tự build từ utilities -->
  <article class="bg-surface-white rounded-md shadow-card p-3">
    <h3>Iced Latte</h3>
    <p class="text-text-soft text-sm">Espresso over ice with milk.</p>
  </article>
</template>
```

---

### Ví dụ 4: Feature band (dark green)

```vue
<template>
  <section class="bg-brand-house text-text-white p-9">
    <h2 class="text-jumbo text-text-white">
      Free coffee is just the beginning
    </h2>
    <p class="text-text-white-soft text-lg mt-3">
      Join Starbucks Rewards and earn stars on every order.
    </p>

    <div class="flex gap-3 mt-5">
      <!-- White-filled button cho dark band -->
      <button class="btn-pill bg-surface-white text-brand-accent">
        Sign up for free
      </button>

      <!-- Outlined trắng -->
      <button class="btn-pill bg-transparent text-surface-white border border-surface-white">
        Learn more
      </button>
    </div>
  </section>
</template>
```

Lưu ý: trên `bg-brand-house`, phải override `text-text-white` vì h2 default màu đen sẽ không đọc được.

---

### Ví dụ 5: Frap floating button

```vue
<template>
  <main>
    <!-- Nội dung trang -->

    <!-- Frap luôn fixed bottom-right, không cần wrapper -->
    <button class="btn-frap" aria-label="Order">
      <ShoppingBagIcon class="w-6 h-6" />
    </button>
  </main>
</template>
```

`btn-frap` đã có sẵn: `position: fixed`, kích thước, shadow, z-index — chỉ cần đặt 1 cái trong app.

---

### Ví dụ 6: Rewards Cost Pill (Gold)

```vue
<template>
  <span class="inline-flex items-center px-3 py-1 rounded-pill border border-gold text-gold text-micro font-bold">
    200★ item
  </span>
</template>
```

Lưu ý: gold chỉ dùng cho Rewards. Nếu thấy mình viết `text-gold` ngoài context Rewards → sai.

---

### Ví dụ 7: Form input với floating label

```vue
<template>
  <label class="block">
    <span class="block text-sm text-text-soft mb-1">Email</span>
    <input
      type="email"
      class="w-full px-3 py-3 bg-surface-white border border-border-input rounded-sm
             focus:border-brand-accent focus:outline-none
             transition-colors duration-200"
    />
  </label>
</template>
```

Spacing dùng token `border-border-input`, focus chuyển sang `border-brand-accent`.

---

### Ví dụ 8: Layout với spacing tokens

```vue
<template>
  <!-- p-3 = 16px (rhythm constant), gap-4 = 24px, p-9 = 64px -->
  <section class="p-9">
    <div class="flex gap-4">
      <article class="card-content flex-1">Card 1</article>
      <article class="card-content flex-1">Card 2</article>
      <article class="card-content flex-1">Card 3</article>
    </div>
  </section>
</template>
```

| Spacing | Pixel | Khi nào dùng |
|---|---|---|
| `p-1` | 4px | Tightest inline |
| `p-2` | 8px | Small gap, button vertical |
| `p-3` | 16px | **Default — dùng nhiều nhất** |
| `p-4` | 24px | Section inner |
| `p-5` | 32px | Major section |
| `p-6` | 40px | Large breathing |
| `p-7` | 48px | Section-to-section |
| `p-9` | 64px | Generous section padding |

---

### Ví dụ 9: Responsive

```vue
<template>
  <!-- Mobile: stack | md+: 3 cột -->
  <div class="flex flex-col md:flex-row gap-3">
    <article class="card-content flex-1">Card</article>
    <article class="card-content flex-1">Card</article>
    <article class="card-content flex-1">Card</article>
  </div>

  <!-- Mobile: text nhỏ | lg+: jumbo -->
  <h2 class="text-h2 lg:text-jumbo">Responsive heading</h2>
</template>
```

Breakpoints sinh ra từ `--breakpoint-*`:
- `xs:` ≥ 480px
- `sm:` ≥ 768px
- `md:` ≥ 1024px
- `lg:` ≥ 1440px

---

### Ví dụ 10: Dùng CSS variable trong scoped style

Khi cần style đặc biệt mà utility không có sẵn:

```vue
<template>
  <div class="custom-banner">
    <h2>Special offer</h2>
  </div>
</template>

<style scoped>
.custom-banner {
  /* Dùng CSS variable trực tiếp */
  background: linear-gradient(
    to right,
    var(--color-brand-house),
    var(--color-brand-uplift)
  );
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-card);
}

.custom-banner:hover {
  /* Easing token cho animation đặc biệt */
  transition: transform 0.3s var(--ease-spring);
  transform: translateY(-2px);
}
</style>
```

Đây là lý do `@theme` mạnh — token vừa thành class Tailwind, vừa thành CSS variable native.

---

### Ví dụ 11: Page hoàn chỉnh

```vue
<template>
  <!-- Body đã là warm cream, font sans, text 16px sẵn -->

  <!-- Top nav -->
  <nav class="sticky top-0 bg-surface-white shadow-nav z-100">
    <div class="flex items-center justify-between px-3 md:px-4 lg:px-6 h-nav-md">
      <span class="text-brand-primary font-bold text-lg">Starbucks</span>

      <div class="flex gap-3">
        <button class="btn-pill bg-transparent text-text border border-text">
          Sign in
        </button>
        <button class="btn-pill bg-surface-black text-surface-white text-sm">
          Join now
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="px-3 md:px-4 lg:px-6 py-9">
    <h1>Welcome back</h1>
    <p class="text-text-soft text-lg mt-3 max-w-md">
      Order ahead and get rewards on every cup.
    </p>
    <button class="btn-pill bg-brand-accent text-surface-white border border-brand-accent mt-5">
      Order now
    </button>
  </section>

  <!-- Feature band -->
  <section class="bg-brand-house text-text-white p-9">
    <h2 class="text-jumbo text-text-white">Free coffee is just the beginning</h2>
    <p class="text-text-white-soft text-lg mt-3">Join Rewards.</p>
  </section>

  <!-- Cards grid -->
  <section class="px-3 md:px-4 lg:px-6 py-7">
    <h2>Featured</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
      <article class="card-content">
        <h3>Pink Drink</h3>
        <p class="text-text-soft text-sm mt-2">Refreshing strawberry açaí.</p>
      </article>
      <article class="card-content">
        <h3>Cold Brew</h3>
        <p class="text-text-soft text-sm mt-2">Slow-steeped 20 hours.</p>
      </article>
      <article class="card-content">
        <h3>Latte</h3>
        <p class="text-text-soft text-sm mt-2">Espresso with milk.</p>
      </article>
    </div>
  </section>

  <!-- Frap luôn floating -->
  <button class="btn-frap" aria-label="Order">
    🛒
  </button>
</template>
```

---

### Cheat sheet

| Cần | Class |
|---|---|
| **Colors** | |
| H1 màu brand | `text-brand-primary` |
| CTA fill | `bg-brand-accent text-surface-white` |
| Dark band | `bg-brand-house text-text-white` |
| Card surface | `bg-surface-white` |
| Body text | `text-text` (mặc định) |
| Secondary text | `text-text-soft` |
| Text trên dark | `text-text-white-soft` |
| Rewards gold | `text-gold border-gold` |
| Error | `text-error` |
| **Sizing** | |
| Button radius | `rounded-pill` |
| Card radius | `rounded-md` |
| Body size | `text-base` (mặc định) |
| Heading | `text-h1`, `text-h2`, `text-hero`, `text-jumbo` |
| Tracking | `tracking-normal` (-0.01em) |
| **Effects** | |
| Card shadow | `shadow-card` |
| Nav shadow | `shadow-nav` |
| Frap shadow | `shadow-frap` |
| **Layout** | |
| Default gap | `gap-3` (16px) |
| Section padding | `p-9` (64px) |
| Nav height | `h-nav-md` (83px) |
| **Component classes** | |
| Button base | `.btn-pill` |
| Floating CTA | `.btn-frap` |
| Card | `.card-content` |

---

### 5 sai lầm thường gặp

| ❌ Sai | ✅ Đúng | Vì sao |
|---|---|---|
| `bg-white` | `bg-surface-white` | Token có namespace |
| `text-black` | `text-text` | Pure black chọi với canvas cream |
| `rounded-lg` | `rounded-pill` cho button | Pill là universal radius |
| `shadow-md` (Tailwind default) | `shadow-card` | Đã override, default không tồn tại |
| `<h1 class="text-3xl font-bold text-green-700">` | `<h1>` (HTML thuần) | Đã setup base, viết thuần là đủ |

---

### Quy trình quyết định khi viết UI

```
Bắt đầu với HTML thuần
       ↓
Có cần khác default không?
       ├── KHÔNG → Xong
       └── CÓ → Thêm utility class
                   ↓
                Có pattern lặp lại nhiều lần không?
                   ├── KHÔNG → Để utility inline
                   └── CÓ → Tạo class component trong @layer components
```

Bắt đầu đơn giản, chỉ extract khi thực sự lặp lại 3+ lần.