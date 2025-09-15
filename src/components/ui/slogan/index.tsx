export default function Slogan() {
      const bios=["Rise, shine, and chase your brightest dreams.", "Grow through what you go through—strength lies in the journey.", "Small steps, big wins; progress is always a victory.", "Believe in your potential, and watch it turn into power.", "Today’s effort plants tomorrow’s success—keep sowing.", "Courage fuels action; action fuels change—start now.", "Optimism lights the path; keep walking forward.", "Every challenge is a chance to grow stronger.", "Your drive defines your destiny—keep pushing forward.", "The best is yet to come—keep reaching for it."]
const bio=bios[Math.floor(Math.random()*bios.length)]
    console.log(bio);
  return (
      <p>{bio}</p>
  )
}
