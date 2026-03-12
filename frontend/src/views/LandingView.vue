<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <!-- Hero section: softer blue gradient, business-focused copy -->
    <section class="bg-gradient-to-br from-indigo-600 via-sky-600 to-cyan-500 text-white pb-16">
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
              class="bg-amber-300 text-slate-900 px-4 py-2 rounded-full font-semibold shadow hover:bg-amber-200 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Sign in
            </router-link>
          </div>
        </div>
      </header>

      <main class="max-w-6xl mx-auto px-4 pt-10 flex flex-col md:flex-row items-center gap-10">
        <!-- Left text block -->
        <div class="md:w-1/2 text-center md:text-left">
          <p class="uppercase tracking-wide text-amber-100 text-xs font-semibold mb-2">
            {{ ui.t('landing.ctaSecure') }}
          </p>
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            {{ ui.t('landing.headline') }}
          </h1>
          <p class="text-indigo-50 text-sm md:text-base mb-3">
            {{ ui.t('landing.problem') }}
          </p>
          <p class="text-indigo-50 text-sm md:text-base mb-6">
            {{ ui.t('landing.solution') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <router-link
              to="/login"
              class="inline-flex items-center justify-center bg-amber-300 text-slate-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-amber-200 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Sign in to dashboard
            </router-link>
            <router-link
              to="/register"
              class="inline-flex items-center justify-center border border-white/60 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
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
              Only authorized users can see live stock, daily sales totals and profit summaries.
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
      <p class="text-xs text-slate-600 text-center max-w-2xl">
        Without logging in you cannot view or modify any information. This protects your business data, while the
        system automatically tracks each product’s price, remaining quantity, daily sales and estimated profit – helping
        you quickly detect losses, compare performance over days, and make better stock decisions.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useUiStore } from '../stores/ui';

const ui = useUiStore();
</script>
