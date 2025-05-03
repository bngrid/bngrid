import cx from '@/utils/cx'
import { memo } from 'react'

const loaders = ['animate-loader-a', 'animate-loader-b', 'animate-loader-c']

const Loader = memo(
  function Loader() {
    return (
      <div className="relative size-[2.7rem]">
        {loaders.map(block => (
          <div className={cx('absolute rounded-[0.3rem] bg-current/30', block)} key={block} />
        ))}
      </div>
    )
  },
  () => true
)

export default Loader
