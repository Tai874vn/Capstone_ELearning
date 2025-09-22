'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// Common country codes
const countries = [
  { code: '+1', name: 'United States', flag: '🇺🇸', iso: 'US' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷', iso: 'TR' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+33', name: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '+39', name: 'Italy', flag: '🇮🇹', iso: 'IT' },
  { code: '+34', name: 'Spain', flag: '🇪🇸', iso: 'ES' },
  { code: '+86', name: 'China', flag: '🇨🇳', iso: 'CN' },
  { code: '+91', name: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', iso: 'JP' },
]

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  defaultCountry?: string
  onChange?: (value: string) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, defaultCountry = 'US', onChange, value, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [selectedCountry, setSelectedCountry] = React.useState(
      countries.find((country) => country.iso === defaultCountry) || countries[0]
    )
    const [phoneNumber, setPhoneNumber] = React.useState(
      typeof value === 'string' ? value.replace(selectedCountry.code, '') : ''
    )

    const handlePhoneChange = (newPhoneNumber: string) => {
      setPhoneNumber(newPhoneNumber)
      const fullNumber = selectedCountry.code + newPhoneNumber
      onChange?.(fullNumber)
    }

    const handleCountryChange = (country: typeof countries[0]) => {
      setSelectedCountry(country)
      const fullNumber = country.code + phoneNumber
      onChange?.(fullNumber)
      setOpen(false)
    }

    React.useEffect(() => {
      if (typeof value === 'string') {
        const country = countries.find((c) => value.startsWith(c.code))
        if (country) {
          setSelectedCountry(country)
          setPhoneNumber(value.replace(country.code, ''))
        }
      }
    }, [value])

    return (
      <div className="flex">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[120px] justify-between rounded-r-none border-r-0 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="text-sm">{selectedCountry.code}</span>
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.iso}
                      value={country.name}
                      onSelect={() => handleCountryChange(country)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedCountry.iso === country.iso
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <span className="text-lg mr-2">{country.flag}</span>
                      <span className="flex-1">{country.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {country.code}
                      </span>
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          {...props}
          ref={ref}
          type="tel"
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className={cn(
            'rounded-l-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400',
            className
          )}
        />
      </div>
    )
  }
)
PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }