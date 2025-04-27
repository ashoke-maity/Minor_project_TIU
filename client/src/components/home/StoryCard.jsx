import Card from "../ui/Card"

function StoryCard({ image, name, classInfo, description }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full w-full max-w-sm justify-center">
      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="p-6">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{classInfo}</p>
        <p className="text-sm text-muted-foreground mt-4">{description}</p>
      </div>
    </Card>
  )
}

export default StoryCard
