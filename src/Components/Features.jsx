import React from 'react'
import { Truck, Lock, RotateCcw, Clock } from 'lucide-react'

const features = [
    {icon: Truck, text: 'Free Shipping', subtext: 'On orders over $100'},
    {icon: Lock, text: 'Secure Payment', subtext: '100% protected payments'},
    {icon: RotateCcw, text: 'Easy Returns', subtext: '30-day return policy'},
    {icon: Clock, text: '24/7 Support', subtext: 'Dedicated customer service'},
]
const Features = () => {

  return (
    <div className='heroFeatures'>
      <div className='Features' >
            {features.map((feature, index)=> {
               return <div key={index} className='icon'>
                    <feature.icon  aria-hidden="true" className='featureicon' size={30} />
                    <div className='iconFeatures'>
                        <p className='iconp'>{feature.text}</p>
                        <p>{feature.subtext}</p>
                    </div>
                </div>
            })}
      </div>
    </div>
  )
}

export default Features