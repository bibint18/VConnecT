import image1 from '../../../assets/home2.png'
export default function FeaturedImage() {
  return (
    <div className="my-8">
      <div className="rounded-lg overflow-hidden">
        <img
          src={image1}
          alt="Conference discussion"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  )
}

