import clsx from 'clsx'

const Text = ({ children, className }: { children: string; className?: string }) => {
  return (
    <span key={children} className={clsx(className, 'animate-in fade-in duration-600')}>
      {children}
    </span>
  )
}

export default Text
