<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <!-- HERO: matches the marketing image layout -->
    <section class="relative overflow-hidden bg-gradient-to-b from-sky-700 via-sky-600 to-sky-500 text-white pb-16">
      <!-- soft background shapes -->
      <div class="pointer-events-none absolute inset-0 opacity-40">
        <div class="absolute -top-20 -left-32 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl"></div>
        <div class="absolute top-40 -right-32 h-80 w-80 rounded-full bg-blue-500/40 blur-3xl"></div>
      </div>

      <!-- top nav / brand -->
      <header class="relative border-b border-white/10 bg-sky-900/20 backdrop-blur">
        <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sky-700 text-xs font-extrabold shadow-lg"
              >SM</span
            >
            <div>
              <p class="text-[11px] uppercase tracking-[0.18em] text-sky-100/90">Smart Stock Control</p>
              <p class="text-sm font-semibold leading-tight">Inventory Management System</p>
            </div>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <router-link
              to="/login"
              class="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/70 text-sky-50/90 hover:bg-white/10 font-semibold transition"
            >
              View Dashboard
            </router-link>
            <router-link
              to="/register"
              class="inline-flex items-center justify-center px-5 py-2 rounded-full bg-amber-300 text-sky-900 font-semibold shadow-lg hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-800 transition"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </header>

      <!-- hero content -->
      <main class="relative max-w-6xl mx-auto px-4 pt-10 flex flex-col lg:flex-row items-center gap-10">
        <!-- text -->
        <div class="lg:w-5/12 text-center lg:text-left">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Smart Stock Control<br class="hidden sm:block" />
            &amp; Inventory Management System
          </h1>
          <p class="text-sm md:text-base text-sky-100/90 mb-3">
            Manage your inventory, monitor stock usage, track distribution and generate reports &mdash; all from one
            powerful dashboard.
          </p>
          <p class="text-sm md:text-base text-sky-100/90 mb-6">
            Designed for shop owners and managers who want to stop stock losses, understand daily profit and see what is
            really happening in their business.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <router-link
              to="/register"
              class="inline-flex items-center justify-center bg-amber-300 text-slate-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-800 text-sm"
            >
              Get Started
            </router-link>
            <router-link
              to="/login"
              class="inline-flex items-center justify-center border border-white/70 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 text-sm"
            >
              View Dashboard
            </router-link>
          </div>
        </div>

        <!-- illustrative dashboard cards (static) -->
        <div class="lg:w-7/12 flex justify-center">
          <div class="relative w-full max-w-xl">
            <div
              class="absolute -top-6 -left-6 hidden md:block h-16 w-16 rounded-2xl bg-sky-900/40 backdrop-blur border border-white/10"
            ></div>
            <div
              class="absolute -bottom-6 -right-4 hidden md:block h-14 w-14 rounded-2xl bg-amber-300/90 text-slate-900 flex items-center justify-center shadow-xl"
            >
              <span class="text-xs font-semibold">Alerts</span>
            </div>
            <div
              class="rounded-3xl bg-slate-900/90 border border-sky-300/40 shadow-[0_18px_45px_rgba(15,23,42,0.8)] p-4 space-y-3"
            >
              <div class="flex items-center justify-between text-xs text-slate-200 mb-1">
                <p class="font-semibold">Stock Control Dashboard</p>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px]"
                  >Live Monitoring</span
                >
              </div>
              <div class="grid grid-cols-2 gap-3 text-[11px]">
                <div class="rounded-2xl bg-slate-800/90 p-3">
                  <p class="text-slate-300 mb-1 font-semibold">Quick Overview</p>
                  <ul class="space-y-0.5 text-slate-400">
                    <li>In stock items</li>
                    <li>Out of stock alerts</li>
                    <li>Damaged &amp; expired</li>
                  </ul>
                </div>
                <div class="rounded-2xl bg-slate-800/90 p-3">
                  <p class="text-slate-300 mb-1 font-semibold">Stock Usage</p>
                  <p class="text-slate-400">
                    Simple charts that show how your stock is moving every day.
                  </p>
                </div>
                <div class="rounded-2xl bg-slate-800/90 p-3 col-span-2">
                  <p class="text-slate-300 mb-1 font-semibold">Profit &amp; Loss</p>
                  <p class="text-slate-400">
                    See total sales, cost, and estimated profit so you can make better decisions faster.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>

    <!-- PROBLEM SECTION -->
    <section class="bg-white py-12 border-t border-slate-100">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-base md:text-lg font-semibold text-slate-900 mb-1">The Problem We Solve</h2>
        <p class="text-sm md:text-base text-sky-700 font-semibold mb-5">Inventory management challenges</p>
        <p class="text-sm md:text-base text-slate-600 mb-8">
          Many small businesses still track stock on paper or in simple notebooks. This makes it easy for items to be
          stolen or lost without anyone noticing, and very hard to know the real daily profit.
        </p>
        <div class="grid gap-6 md:grid-cols-3 text-left text-sm">
          <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p class="font-semibold text-slate-900 mb-2">Poor Tracking</p>
            <p class="text-slate-600 text-xs md:text-sm">
              Shrinkage, missing stock and manual errors because stock in/out is not recorded in one system.
            </p>
          </div>
          <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p class="font-semibold text-slate-900 mb-2">Stock Shortages / Over‑stocking</p>
            <p class="text-slate-600 text-xs md:text-sm">
              Difficult to know when to re‑order, leading to empty shelves or too much money locked in slow stock.
            </p>
          </div>
          <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p class="font-semibold text-slate-900 mb-2">Lack of Analytics</p>
            <p class="text-slate-600 text-xs md:text-sm">
              No clear view of which products are profitable, which are expiring and where losses are coming from.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SOLUTION SECTION -->
    <section class="bg-slate-900 text-slate-50 py-12">
      <div class="max-w-5xl mx-auto px-4 text-center">
        <h2 class="text-base md:text-lg font-semibold mb-1">
          Our Solution: <span class="text-sky-300">Powerful Stock Control</span>
        </h2>
        <p class="text-sm md:text-base text-slate-300 mb-8">
          Simplify your inventory management with an all‑in‑one platform that puts you in full control from any
          connected device.
        </p>
        <div class="grid gap-6 md:grid-cols-3 text-left text-sm">
          <div class="rounded-2xl bg-slate-800/80 border border-slate-700 p-5">
            <p class="font-semibold text-slate-50 mb-2">Real‑Time Tracking</p>
            <p class="text-slate-300 text-xs md:text-sm">
              Monitor stock levels, expiry dates, damaged quantity and movements instantly across all products.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-800/80 border border-slate-700 p-5">
            <p class="font-semibold text-slate-50 mb-2">Centralized Control</p>
            <p class="text-slate-300 text-xs md:text-sm">
              Manage products, suppliers and stock transactions from one secure dashboard with user roles.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-800/80 border border-slate-700 p-5">
            <p class="font-semibold text-slate-50 mb-2">Make Better Decisions</p>
            <p class="text-slate-300 text-xs md:text-sm">
              Use sales and profit/loss reports to see which products are growing your business and where you are losing
              money.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="bg-slate-50 py-10">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-base md:text-lg font-semibold text-slate-900 mb-2">Ready to Optimize Your Inventory?</h2>
        <p class="text-sm md:text-base text-slate-600 mb-5">
          Get started with this Stock Management System and take control of your stock, sales and daily profit.
        </p>
        <ul class="text-left inline-block text-xs md:text-sm text-slate-600 space-y-1 mb-6">
          <li>✓ Know exactly what is in stock, expired or damaged at any time.</li>
          <li>✓ Keep track of every stock in/out movement and who performed it.</li>
          <li>✓ See daily sales and estimated profit in clear, simple reports.</li>
        </ul>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <router-link
            to="/register"
            class="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow"
          >
            Create an Account
          </router-link>
          <router-link
            to="/login"
            class="inline-flex items-center justify-center border border-sky-300 text-sky-700 px-6 py-3 rounded-full text-sm font-semibold hover:bg-sky-50"
          >
            View Dashboard
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>
