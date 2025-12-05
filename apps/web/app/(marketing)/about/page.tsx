import { createMetadata } from '@/lib/metadata'

const title = 'About Us'
const description =
  'Learn more about our mission, values, and the team behind our services.'
export const metadata = createMetadata({
  title,
  description,
  openGraph: { images: [`/api/og?title=${title}&description=${description}`] },
})

export default function AboutPage() {
  return (
    <main className='container flex-1 py-6'>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet
        massa vitae consectetur egestas. Vestibulum tempor blandit velit, a
        commodo felis mollis vitae. Nam sit amet mollis felis, sit amet
        hendrerit metus. Etiam auctor aliquet metus, nec feugiat nunc efficitur
        in. Nam sit amet quam ut nisl blandit auctor. In laoreet pharetra
        fermentum. Phasellus a nisl porta, lobortis enim sed, gravida urna.
        Pellentesque consequat, eros et elementum finibus, nunc sem ullamcorper
        felis, at elementum tellus turpis quis neque. In porttitor mi sed
        commodo pretium. Morbi egestas lacinia ipsum. Donec tristique metus ex,
        nec finibus lacus finibus non. Vestibulum viverra felis nulla. Aliquam
        tincidunt neque at urna aliquet, vehicula viverra nisi porta. Aliquam
        volutpat quis est consequat eleifend.
      </p>

      <p>
        Suspendisse malesuada pellentesque dolor. Phasellus malesuada nisl
        lorem, ut semper orci faucibus eget. Aenean ut maximus eros, ac
        dignissim enim. Morbi quis ultricies enim, sed condimentum lacus.
        Vivamus libero leo, luctus vitae varius et, interdum porttitor augue.
        Etiam vitae laoreet nisi. Nulla facilisi. Quisque in vulputate arcu.
        Donec non urna eu mauris tempus varius. Suspendisse dolor diam, pretium
        at sapien sed, tristique pellentesque ex. Nunc iaculis vulputate leo
        quis ultrices. Suspendisse id aliquet eros. Cras consectetur turpis
        nulla, tempor tristique odio condimentum nec.
      </p>

      <p>
        Sed viverra eros purus, eget dictum mauris tempor non. Integer tristique
        dui vitae ex sodales varius. Vivamus gravida ex nec odio tempor aliquet.
        Quisque cursus orci sem, ut cursus lectus euismod nec. Maecenas vitae
        interdum arcu. Cras vitae arcu turpis. Sed volutpat libero non molestie
        condimentum. Donec eu quam ultricies tortor placerat luctus. In
        fermentum lobortis pretium. Quisque in magna sit amet diam molestie
        tincidunt et eu tellus.
      </p>

      <p>
        Aliquam erat volutpat. Morbi massa odio, blandit non nibh eu, laoreet
        laoreet nulla. Proin placerat purus ac quam semper, eget malesuada augue
        vestibulum. Etiam euismod posuere libero in hendrerit. Pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis
        egestas. Pellentesque nec finibus orci. Sed congue, odio ornare aliquet
        commodo, ex mi dictum metus, sed dictum ex massa ac metus. Suspendisse
        placerat enim vitae egestas luctus. Ut id scelerisque nulla. In id
        dapibus metus. Sed quis urna vitae risus viverra interdum. Maecenas ac
        lectus quis metus hendrerit convallis non viverra mauris. Fusce semper
        semper enim et maximus. Aenean sollicitudin risus velit, a egestas sem
        euismod vel. Vivamus ac ipsum ipsum.
      </p>

      <p>
        Morbi fermentum nunc lacus, ac pulvinar ante porttitor aliquet. Ut
        mollis, enim sed bibendum ullamcorper, arcu odio tincidunt nibh, ac
        porttitor justo libero et augue. In ac libero vitae nibh placerat
        fringilla et vel lectus. Etiam vitae justo mattis risus interdum
        feugiat. Maecenas urna arcu, aliquet ac velit sed, pretium efficitur
        nibh. Mauris facilisis commodo eros molestie convallis. Curabitur
        bibendum eu dolor ac faucibus. Nulla hendrerit, urna quis interdum
        condimentum, orci augue mattis lectus, nec dictum mauris ex a quam.
        Fusce imperdiet metus faucibus dolor fringilla fermentum. Vivamus semper
        eros quis rutrum consequat. In tristique est a risus vestibulum pretium.
        Morbi sit amet risus semper, sollicitudin nunc eget, fringilla nisl. Ut
        pulvinar erat nunc, non porta enim eleifend sed. Aenean venenatis
        dignissim mauris. Aliquam feugiat magna elit, a rhoncus leo eleifend ac.
        Etiam eu viverra ligula, eget ultrices elit.
      </p>
    </main>
  )
}
