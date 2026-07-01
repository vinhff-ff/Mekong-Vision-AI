import { DeviceFrameset } from 'react-device-frameset'
import 'react-device-frameset/styles/marvel-devices.min.css'
import Mobile from './ui-mobile-chung'

export default function MobileOff() {
  return (
    <div className="mobile-wrapper">
      <div className="mobile-frame">
        <DeviceFrameset device="iPhone X" color="black">
          <Mobile />
        </DeviceFrameset>
      </div>
    </div>
  )
}