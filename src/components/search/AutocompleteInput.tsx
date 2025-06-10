
import React, { useState, useRef, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui-custom/Input";
import { motion, AnimatePresence } from "framer-motion";

interface AutocompleteOption {
  code: string;
  city: string;
  country: string;
}

interface AutocompleteInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: AutocompleteOption[];
  disabled?: boolean;
}

const mockCities: AutocompleteOption[] = [
  { code: "GRU", city: "São Paulo", country: "Brasil" },
  { code: "GIG", city: "Rio de Janeiro", country: "Brasil" },
  { code: "BSB", city: "Brasília", country: "Brasil" },
  { code: "SSA", city: "Salvador", country: "Brasil" },
  { code: "FOR", city: "Fortaleza", country: "Brasil" },
  { code: "REC", city: "Recife", country: "Brasil" },
  { code: "CWB", city: "Curitiba", country: "Brasil" },
  { code: "POA", city: "Porto Alegre", country: "Brasil" },
  { code: "LIS", city: "Lisboa", country: "Portugal" },
  { code: "MAD", city: "Madrid", country: "Espanha" },
  { code: "BCN", city: "Barcelona", country: "Espanha" },
  { code: "CDG", city: "Paris", country: "França" },
  { code: "FCO", city: "Roma", country: "Itália" },
  { code: "LHR", city: "Londres", country: "Reino Unido" },
];

export function AutocompleteInput({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.length >= 2) {
      const filtered = mockCities.filter(
        (option) =>
          option.city.toLowerCase().includes(inputValue.toLowerCase()) ||
          option.code.toLowerCase().includes(inputValue.toLowerCase()) ||
          option.country.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredOptions([]);
      setIsOpen(false);
    }
  }, [inputValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    const selectedValue = `${option.city} (${option.code})`;
    setInputValue(selectedValue);
    onChange(selectedValue);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 2) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          label={label}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          className="h-16 text-lg rounded-xl pl-14 pr-12"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        <MapPin 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-econotrip-blue" 
          aria-hidden="true" 
        />
        <Search 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
          aria-hidden="true" 
        />
      </div>

      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto"
            role="listbox"
          >
            {filteredOptions.map((option, index) => (
              <motion.button
                key={`${option.code}-${index}`}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className="w-full px-4 py-4 text-left hover:bg-econotrip-orange/10 focus:bg-econotrip-orange/10 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                role="option"
                aria-selected={false}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-econotrip-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-sm text-econotrip-blue">
                      {option.code}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-econotrip-blue text-lg">
                      {option.city}
                    </div>
                    <div className="text-sm text-gray-600">{option.country}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
