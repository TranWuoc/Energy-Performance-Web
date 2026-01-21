import { Controller, useFormContext } from 'react-hook-form';
import Input from './Input';

type InputFieldProps = {
    name: string;
    component?: React.ComponentType<any>;
    size?: 'timeSize' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    icon?: string;
    iconPosition?: 'left' | 'right';
    label?: string;
    [key: string]: unknown;
};

const sizeClasses = {
    sm: 'w-[60px]',
    timeSize: 'w-[220px]',
    md: 'w-[250px]',
    lg: 'w-[280px]',
    xl: 'w-[300px]',
    full: 'w-full',
};

const DEFAULT_SIZE = 'md';

function InputField({
    name,
    component: Componenet = Input,
    size = DEFAULT_SIZE,
    icon,
    iconPosition = 'right',
    label,
    ...rest
}: InputFieldProps) {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const messageError = (errors[name]?.message as string) || '';

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        {label && <span className="whitespace-nowrap">{label}</span>}
                        <div className={`flex flex-col ${sizeClasses[size]}`}>
                            <div className="relative flex items-center">
                                {icon && iconPosition === 'left' && (
                                    <img
                                        src={icon}
                                        alt="icon"
                                        className="pointer-events-none absolute left-3 h-5 w-5"
                                    />
                                )}
                                <Componenet
                                    {...field}
                                    {...rest}
                                    value={field.value ?? ''}
                                    selected={field.value || []}
                                    onChange={field.onChange}
                                    className={`${rest.className} ${icon && iconPosition === 'left' ? 'pl-10' : ''} ${icon && iconPosition === 'right' ? 'pr-10' : ''}`}
                                />
                                {icon && iconPosition === 'right' && (
                                    <img
                                        src={icon}
                                        alt="icon"
                                        className="pointer-events-none absolute right-3 h-5 w-5"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <p className={`mt-1 min-h-[20px] text-sm text-red-500 ${!messageError && 'invisible'}`}>
                        {messageError || ' '}
                    </p>
                </div>
            )}
        />
    );
}

export default InputField;
