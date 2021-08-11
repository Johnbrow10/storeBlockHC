import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'

import productReleaseDate from './graphql/productReleaseDate.graphql'
import type { TimeSplit } from './typings/global'
import { getTwoDaysFromNow, tick } from './utils/time'

// pega dois dias no futuro e crava nessa variavel
const DEFAULT_TARGET_DATE = getTwoDaysFromNow()

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CountdownProps {}

// criar a variavel global para importar o css
const CSS_HANDLES = ['countdown'] as const

// eslint-disable-next-line no-empty-pattern
const Countdown: StorefrontFunctionComponent<CountdownProps> = ({}) => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  // mensagens padrões caso nao estiver passado uma mensagem nela

  // usar o hook do css
  const handle = useCssHandles(CSS_HANDLES)

  const productContextValue = useProduct()

  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: productContextValue?.product?.linkText,
    },
    ssr: false,
  })

  if (!productContextValue?.product) {
    return (
      <div>
        <span>There is no product context.</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <span>Error</span>
      </div>
    )
  }

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  return (
    <div className={`${handle.countdown} db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {},
}

export default Countdown
