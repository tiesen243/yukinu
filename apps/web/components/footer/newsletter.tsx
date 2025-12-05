import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@yukinu/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'

export const Newsletter: React.FC = () => (
  <FieldSet className='md:col-span-2 lg:col-span-1'>
    <FieldLegend>Subscribe to our newsletter</FieldLegend>
    <FieldDescription>
      Get the latest updates about new products and promotions.
    </FieldDescription>

    <Field>
      <FieldLabel htmlFor='email'>Email Address</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id='email'
          type='email'
          placeholder='Enter your email'
        />

        <InputGroupAddon align='inline-end'>
          <InputGroupButton>Subscribe</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  </FieldSet>
)
