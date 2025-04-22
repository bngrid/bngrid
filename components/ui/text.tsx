import cx from '@/utils/cx'

const Text = ({ children, className }: { children: string; className?: string }) => {
  return (
    <span className={cx(className, 'animate-in fade-in duration-600')} key={children}>
      {children}
    </span>
  )
}

export default Text
