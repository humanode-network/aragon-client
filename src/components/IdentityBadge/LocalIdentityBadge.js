import React, { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import { IconLabel, GU } from '@aragon/ui'
import { LocalIdentityModalContext } from '../LocalIdentityModal/LocalIdentityModalManager'
import { useLocalIdentity } from '../../hooks'
import { isAddress } from '../../web3-utils'
import {
  IdentityContext,
  identityEventTypes,
} from '../IdentityManager/IdentityManager'
import IdentityBadgeWithNetwork from './IdentityBadgeWithNetwork'
import LocalIdentityPopoverTitle from './LocalIdentityPopoverTitle'

function LocalIdentityBadge({ entity, forceAddress, ...props }) {
  const address = isAddress(entity) ? entity : null

  const { identityEvents$ } = useContext(IdentityContext)
  const { showLocalIdentityModal } = useContext(LocalIdentityModalContext)
  const { name: label, handleResolve } = useLocalIdentity(address)

  const handleClick = useCallback(() => {
    showLocalIdentityModal(address)
      .then(handleResolve)
      .then(() =>
        identityEvents$.next({ type: identityEventTypes.MODIFY, address })
      )
      .catch(e => {
        /* user cancelled modify intent */
      })
  }, [address, identityEvents$, handleResolve, showLocalIdentityModal])

  if (address === null) {
    return <IdentityBadgeWithNetwork {...props} label={entity} />
  }

  return (
    <IdentityBadgeWithNetwork
      {...props}
      entity={address}
      label={(!forceAddress && label) || ''}
      popoverAction={{
        label: (
          <div
            css={`
              display: flex;
              align-content: center;
            `}
          >
            <IconLabel
              css={`
                margin-right: ${1 * GU}px;
              `}
            />
            {label ? 'Edit' : 'Add'} custom label
          </div>
        ),
        onClick: handleClick,
      }}
      popoverTitle={
        label ? <LocalIdentityPopoverTitle label={label} /> : 'Address'
      }
    />
  )
}

LocalIdentityBadge.propTypes = {
  entity: PropTypes.string,
  forceAddress: PropTypes.bool,
}

export default LocalIdentityBadge
