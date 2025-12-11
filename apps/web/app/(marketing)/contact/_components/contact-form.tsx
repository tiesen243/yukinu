import { Button } from '@yukinu/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@yukinu/ui/field'
import { Input } from '@yukinu/ui/input'
import { Textarea } from '@yukinu/ui/textarea'

export const ContactForm: React.FC = () => (
  <form className='space-y-6'>
    <FieldSet>
      <legend className='sr-only'>Contact form</legend>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='fullname'>Full Name</FieldLabel>
          <Input id='fullname' name='fullname' placeholder='Yukikaze' />
        </Field>

        <Field>
          <FieldLabel htmlFor='email'>Email Address</FieldLabel>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='yukikaze@tiesen.id.vn'
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='subject'>Subject</FieldLabel>
          <Input id='subject' name='subject' placeholder='How can we help?' />
        </Field>

        <Field>
          <FieldLabel htmlFor='message'>Message</FieldLabel>
          <Textarea
            id='message'
            name='message'
            placeholder='Tell us more about your inquiry...'
          />
        </Field>

        <Field>
          <Button type='submit'>Send Message</Button>
        </Field>
      </FieldGroup>
    </FieldSet>
  </form>
)
