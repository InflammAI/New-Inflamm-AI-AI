import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import '../styles/tokens.css';

const meta = {
  title: 'Inflamm AI/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0B0F14' },
      ],
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper
const SidebarWrapper = ({ collapsed }: { collapsed?: boolean }) => {
  const [activeModule, setActiveModule] = useState('vytap');
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        activeModule={activeModule}
        onNavigate={setActiveModule}
        collapsed={collapsed}
      />
      <div style={{ flex: 1, padding: '2rem', color: 'white' }}>
        <h1>Active Module: {activeModule}</h1>
        <p>Click sidebar items to navigate</p>
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    activeModule: 'vytap',
    onNavigate: () => {},
    collapsed: false,
  },
  render: () => <SidebarWrapper />,
};

export const Collapsed: Story = {
  args: {
    activeModule: 'vytap',
    onNavigate: () => {},
    collapsed: true,
  },
  render: () => <SidebarWrapper collapsed />,
};

export const ActiveVyTap: Story = {
  args: {
    activeModule: 'vytap',
    onNavigate: () => {},
    collapsed: false,
  },
};

export const ActiveVitalsync: Story = {
  args: {
    activeModule: 'vitalsync',
    onNavigate: () => {},
    collapsed: false,
  },
};

export const ActiveChat: Story = {
  args: {
    activeModule: 'chat',
    onNavigate: () => {},
    collapsed: false,
  },
};

export const ActiveSciCast: Story = {
  args: {
    activeModule: 'scicast',
    onNavigate: () => {},
    collapsed: false,
  },
};

export const ActiveBlog: Story = {
  args: {
    activeModule: 'blog',
    onNavigate: () => {},
    collapsed: false,
  },
};

export const MobileBottomNav: Story = {
  args: {
    activeModule: 'vytap',
    onNavigate: () => {},
    collapsed: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div style={{ height: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <div style={{ padding: '1rem', color: 'white' }}>
        <h1>Mobile View</h1>
        <p>Sidebar hidden, bottom nav shown</p>
      </div>
      {/* Bottom nav would be rendered by the parent page component */}
    </div>
  ),
};
