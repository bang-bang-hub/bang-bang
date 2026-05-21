import type { Meta, StoryObj } from '@storybook/nextjs'
import { OndeComprarSection } from './index'

// Home variant — KPIs hard-coded + WishlistForm. PDV list browser lives at
// /onde-encontrar and is not part of this story.

const meta = {
  title: 'Sections/OndeComprar',
  component: OndeComprarSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Seção home "Quero Bang Bang na minha cidade" — 3 KPIs (PDVs, cidades, estados) ' +
          'sobre planilha de vendas + WishlistForm. Browser completo de PDVs está em ' +
          '/onde-encontrar.',
      },
    },
  },
} satisfies Meta<typeof OndeComprarSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
}

export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: 'tablet' } },
}
