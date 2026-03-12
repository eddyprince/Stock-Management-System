<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <!-- Hero section with purple gradient like the reference design -->
    <section class="bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#9333ea] text-white pb-16">
      <header class="border-b border-white/10 bg-white/5 backdrop-blur">
        <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span class="font-semibold text-white text-lg">Stock Management System</span>
          <div class="flex items-center gap-3 text-sm">
            <router-link
              to="/register"
              class="text-indigo-100 hover:text-white font-medium underline-offset-2 hover:underline"
            >
              Create account
            </router-link>
            <router-link
              to="/login"
              class="bg-amber-400 text-slate-900 px-4 py-2 rounded-full font-semibold shadow hover:bg-amber-300 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Sign in
            </router-link>
          </div>
        </div>
      </header>

      <main class="max-w-6xl mx-auto px-4 pt-10 flex flex-col md:flex-row items-center gap-10">
        <!-- Left text block -->
        <div class="md:w-1/2 text-center md:text-left">
          <p class="uppercase tracking-wide text-amber-200 text-xs font-semibold mb-2">
            Stock control made simple
          </p>
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Solutions rooted<br class="hidden sm:block" />
            in code and design
          </h1>
          <p class="text-indigo-100 text-sm md:text-base mb-6">
            Track in stock, out of stock, expired and damaged quantities in one modern dashboard.
            Secure login ensures that only authorized users can see and update data.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <router-link
              to="/login"
              class="inline-flex items-center justify-center bg-amber-400 text-slate-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-amber-300 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Sign in to dashboard
            </router-link>
            <router-link
              to="/register"
              class="inline-flex items-center justify-center border border-white/50 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Create account
            </router-link>
          </div>
        </div>

        <!-- Right light card to echo the screenshot layout -->
        <div class="md:w-1/2 flex justify-center">
          <div class="w-full max-w-sm bg-white text-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h2 class="text-lg font-semibold text-slate-900 mb-1">Sign in or create an account</h2>
            <p class="text-xs text-slate-500 mb-2">
              You must be authenticated to view stock details, reports and user accounts.
            </p>
            <router-link
              to="/login"
              class="block w-full bg-slate-900 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
            >
              Sign in
            </router-link>
            <router-link
              to="/register"
              class="block w-full border border-slate-200 text-slate-900 text-center py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              Create new account
            </router-link>
          </div>
        </div>
      </main>
    </section>

    <!-- Small footer message -->
    <footer class="flex-1 flex items-center justify-center px-4 py-8">
      <p class="text-xs text-slate-500 text-center max-w-lg">
        Without logging in you cannot view or modify any information. This keeps stock data protected while
        giving each role (admin, stock manager, director, account) a clear dashboard experience.
      </p>
    </footer>
  </div>
</template>

<script setup>
</script>
