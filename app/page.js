import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, DollarSign, Zap, ArrowRight, Package, Recycle, TreePine } from "lucide-react"
import AuthButtons from '@/components/AuthButtons'
export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50'>
      {/* Navigation */}
      <nav className='container mx-auto px-4 py-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600'>
              <Package className='h-5 w-5 text-white' />
            </div>
            <span className='text-xl font-bold text-gray-900'> Ecopack AI</span>
          </div>
          <div>
            <AuthButtons /> {/* Add the buttons here */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='container mx-auto px-4 py-16 lg:py-24'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          {/* Left Content */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <Badge
                variant='outline'
                className='border-emerald-200 bg-emerald-50 text-emerald-700'
              >
                <Leaf className='mr-1 h-3 w-3' />
                AI-Powered Sustainability
              </Badge>
              <h1 className='text-5xl font-bold leading-tight text-gray-900 lg:text-7xl'>
                EcoPack
                <span className='text-emerald-600'> AI</span>
              </h1>
              <p className='max-w-lg text-xl leading-relaxed text-gray-600 lg:text-2xl'>
                Instant, eco-smart packaging picks for every SKU.
                <span className='font-semibold text-emerald-600'>
                  {' '}
                  Reduce costs, save the planet.
                </span>
              </p>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-emerald-600'>85%</div>
                <div className='text-sm text-gray-600'>Plastic Reduction</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>30%</div>
                <div className='text-sm text-gray-600'>Cost Savings</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>
                  {'<2s'}
                </div>
                <div className='text-sm text-gray-600'>Response Time</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Link href='/recommend'>
                <Button
                  size='lg'
                  className='group rounded-xl bg-emerald-600 px-8 py-4 text-lg text-white shadow-lg transition-all duration-300 hover:bg-emerald-700 hover:shadow-xl'
                >
                  Get Started
                  <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
                </Button>
              </Link>
              <Button
                variant='outline'
                size='lg'
                className='rounded-xl border-2 border-gray-300 bg-transparent px-8 py-4 text-lg transition-all duration-300 hover:border-emerald-600'
              >
                View Demo
              </Button>
            </div>

            {/* Trust Indicator */}
            <div className='flex items-center space-x-2 text-sm text-gray-600'>
              <Recycle className='h-4 w-4 text-blue-600' />
              <span>100% Sustainable</span>
            </div>
          </div>

          {/* Right Illustration */}
          <div className='relative'>
            {/* Background Glow */}
            <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400/20 to-blue-400/20 blur-3xl'></div>

            {/* Main Illustration */}
            <div className='relative rounded-3xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-sm'>
              <svg
                width='400'
                height='400'
                viewBox='0 0 400 400'
                className='mx-auto w-full max-w-md'
              >
                {/* Background Circle */}
                <circle
                  cx='200'
                  cy='200'
                  r='180'
                  fill='url(#gradient1)'
                  opacity='0.1'
                />

                {/* Package Box */}
                <rect
                  x='120'
                  y='150'
                  width='160'
                  height='140'
                  fill='#f8fafc'
                  stroke='#e2e8f0'
                  strokeWidth='2'
                  rx='12'
                />

                {/* Package Details */}
                <line
                  x1='120'
                  y1='220'
                  x2='280'
                  y2='220'
                  stroke='#cbd5e1'
                  strokeWidth='1'
                />
                <line
                  x1='200'
                  y1='150'
                  x2='200'
                  y2='290'
                  stroke='#cbd5e1'
                  strokeWidth='1'
                />

                {/* AI Brain Icon */}
                <circle cx='200' cy='100' r='25' fill='#10b981' opacity='0.2' />
                <path
                  d='M185 95 Q200 85 215 95 Q210 100 200 105 Q190 100 185 95'
                  fill='#10b981'
                />
                <circle cx='195' cy='98' r='2' fill='#065f46' />
                <circle cx='205' cy='98' r='2' fill='#065f46' />

                {/* Floating Leaves */}
                <g className='animate-pulse'>
                  <path
                    d='M140 120 Q130 100 120 120 Q130 110 140 120'
                    fill='#10b981'
                  />
                  <path
                    d='M160 110 Q150 90 140 110 Q150 100 160 110'
                    fill='#059669'
                  />
                  <path
                    d='M260 115 Q250 95 240 115 Q250 105 260 115'
                    fill='#10b981'
                  />
                  <path
                    d='M280 125 Q270 105 260 125 Q270 115 280 125'
                    fill='#059669'
                  />
                </g>

                {/* Stems */}
                <line
                  x1='135'
                  y1='120'
                  x2='135'
                  y2='150'
                  stroke='#059669'
                  strokeWidth='2'
                />
                <line
                  x1='155'
                  y1='110'
                  x2='155'
                  y2='150'
                  stroke='#059669'
                  strokeWidth='2'
                />
                <line
                  x1='255'
                  y1='115'
                  x2='255'
                  y2='150'
                  stroke='#059669'
                  strokeWidth='2'
                />
                <line
                  x1='275'
                  y1='125'
                  x2='275'
                  y2='150'
                  stroke='#059669'
                  strokeWidth='2'
                />

                {/* Data Points */}
                <circle cx='320' cy='180' r='4' fill='#3b82f6' />
                <circle cx='80' cy='220' r='4' fill='#8b5cf6' />
                <circle cx='340' cy='260' r='4' fill='#f59e0b' />

                {/* Connecting Lines */}
                <line
                  x1='200'
                  y1='100'
                  x2='320'
                  y2='180'
                  stroke='#3b82f6'
                  strokeWidth='1'
                  opacity='0.3'
                  strokeDasharray='5,5'
                />
                <line
                  x1='200'
                  y1='100'
                  x2='80'
                  y2='220'
                  stroke='#8b5cf6'
                  strokeWidth='1'
                  opacity='0.3'
                  strokeDasharray='5,5'
                />
                <line
                  x1='200'
                  y1='100'
                  x2='340'
                  y2='260'
                  stroke='#f59e0b'
                  strokeWidth='1'
                  opacity='0.3'
                  strokeDasharray='5,5'
                />

                {/* Gradient Definition */}
                <defs>
                  <linearGradient
                    id='gradient1'
                    x1='0%'
                    y1='0%'
                    x2='100%'
                    y2='100%'
                  >
                    <stop offset='0%' stopColor='#10b981' />
                    <stop offset='100%' stopColor='#3b82f6' />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Floating Cards */}
            <div className='absolute -right-4 -top-4 rounded-lg border border-emerald-100 bg-white p-3 shadow-lg'>
              <div className='flex items-center space-x-2'>
                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                <span className='text-xs font-medium text-gray-700'>
                  350g CO₂ Saved
                </span>
              </div>
            </div>

            <div className='absolute -bottom-4 -left-4 rounded-lg border border-blue-100 bg-white p-3 shadow-lg'>
              <div className='flex items-center space-x-2'>
                <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                <span className='text-xs font-medium text-gray-700'>
                  $0.15/unit
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className='container mx-auto px-4 py-20'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 lg:text-4xl'>
            Why Choose EcoPack AI?
          </h2>
          <p className='mx-auto max-w-2xl text-xl text-gray-600'>
            Transform your packaging strategy with AI-powered sustainability
            recommendations
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          <Card className='group rounded-2xl border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg transition-all duration-300 hover:shadow-xl'>
            <CardContent className='space-y-6 p-8 text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 transition-transform duration-300 group-hover:scale-110'>
                <TreePine className='h-8 w-8 text-white' />
              </div>
              <div>
                <h3 className='mb-2 text-xl font-bold text-gray-900'>
                  🌎 Sustainability First
                </h3>
                <p className='leading-relaxed text-gray-700'>
                  Reduce environmental impact by up to 85% with biodegradable,
                  compostable, and recycled packaging solutions
                </p>
              </div>
              <div className='rounded-lg bg-emerald-200/50 p-3'>
                <div className='text-2xl font-bold text-emerald-700'>85%</div>
                <div className='text-sm text-emerald-600'>
                  Plastic Reduction
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='group rounded-2xl border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg transition-all duration-300 hover:shadow-xl'>
            <CardContent className='space-y-6 p-8 text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 transition-transform duration-300 group-hover:scale-110'>
                <DollarSign className='h-8 w-8 text-white' />
              </div>
              <div>
                <h3 className='mb-2 text-xl font-bold text-gray-900'>
                  💰 Cost Optimization
                </h3>
                <p className='leading-relaxed text-gray-700'>
                  Smart algorithms find the perfect balance between protection
                  and cost, saving up to 30% on packaging expenses
                </p>
              </div>
              <div className='rounded-lg bg-blue-200/50 p-3'>
                <div className='text-2xl font-bold text-blue-700'>30%</div>
                <div className='text-sm text-blue-600'>Cost Savings</div>
              </div>
            </CardContent>
          </Card>

          <Card className='group rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg transition-all duration-300 hover:shadow-xl'>
            <CardContent className='space-y-6 p-8 text-center'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 transition-transform duration-300 group-hover:scale-110'>
                <Zap className='h-8 w-8 text-white' />
              </div>
              <div>
                <h3 className='mb-2 text-xl font-bold text-gray-900'>
                  ⚡ Lightning Fast
                </h3>
                <p className='leading-relaxed text-gray-700'>
                  Get instant AI-powered recommendations for any product
                  specification in under 2 second
                </p>
              </div>
              <div className='rounded-lg bg-purple-200/50 p-3'>
                <div className='text-2xl font-bold text-purple-700'>
                  {'<2s'}
                </div>
                <div className='text-sm text-purple-600'>Response Time</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className='container mx-auto px-4 py-20'>
        <div className='rounded-3xl bg-gradient-to-r from-emerald-600 to-blue-600 p-12 text-center text-white'>
          <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>
            Ready to Transform Your Packaging?
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-xl opacity-90'>
            Join the sustainable packaging revolution. Get AI-powered
            recommendations in seconds.
          </p>
          <Link href='/recommend'>
            <Button
              size='lg'
              className='group rounded-xl bg-white px-8 py-4 text-lg text-emerald-600 shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl'
            >
              Start Recommending
              <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='container mx-auto px-4 py-12'>
        <div className='border-t border-gray-200 pt-8'>
          <div className='flex flex-col items-center justify-between md:flex-row'>
            <div className='mb-4 flex items-center space-x-2 md:mb-0'>
              <div className='flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600'>
                <Package className='h-4 w-4 text-white' />
              </div>
              <span className='font-semibold text-gray-900'>EcoPack AI</span>
            </div>
            <p className='text-center text-gray-600 md:text-right'>
              Copyright 2025 • © EcoPack AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
