import { Box, Flex, Spacer, useBoolean, useColorModeValue, useToast } from '@chakra-ui/react';
import { Controller, useForm, useFormState } from 'react-hook-form';

import { putter } from '~/lib/hooks';
import type { EntryWithTags } from '~/pages/api/entries';

import { EntryDate } from './date';
import { EntryEditor } from './editor';
import { EntryFooter } from './footer';
import { EntryTags } from './tags';
import { EntryTitle } from './title';

interface EntryProps {
  entry: EntryWithTags;
}

export const Entry: React.VFC<EntryProps> = ({ entry }) => {
  const [isEditing, { toggle: toggleIsEditing }] = useBoolean(false);
  const borderColor = useColorModeValue('gray.200', 'gray.400');
  const toast = useToast();
  const { control, handleSubmit, register, watch } = useForm<EntryWithTags>({
    defaultValues: { ...entry },
  });
  const { isDirty } = useFormState({ control });

  const showComingSoonToast = () =>
    toast({ title: 'Coming soon!', isClosable: true, position: 'top' });
  const onSubmit = (data: EntryWithTags) => {
    // Right now this is optimistic that it will succeed. Tackle error handling later
    toggleIsEditing();
    // This will have to conditionally be a POST when creation is added
    putter(`/api/entries/${data.uuid}`, data);
  };

  return (
    <Flex
      px={4}
      direction={{ base: 'column-reverse', md: 'row' }}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Spacer display={{ base: 'none', lg: 'block' }} flex="1" />
      <Box flex="3 0" maxW="container.md">
        <EntryTitle isEditing={isEditing} register={register} watch={watch} />
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <EntryEditor text={field.value} isEditing={isEditing} onChange={field.onChange} />
          )}
        />
        <EntryFooter
          isEditing={isEditing}
          hasChanges={isDirty}
          onEdit={toggleIsEditing}
          onCancel={toggleIsEditing}
          onDelete={toggleIsEditing}
          onPhotoAdd={showComingSoonToast}
          onLocationAdd={showComingSoonToast}
        />
      </Box>
      <Box
        flex="1"
        pl={{ base: 0, md: 2 }}
        pt={4}
        pb={4}
        mt="-1em"
        ml={{ base: 0, md: 2 }}
        height="fit-content"
        borderLeftWidth={{ base: '0', md: '2px' }}
        borderLeftColor={borderColor}
      >
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <EntryDate date={field.value} isEditing={isEditing} onChange={field.onChange} />
          )}
        />
        <Box mt={4} pt={4} borderTop="2px" borderTopColor={borderColor}>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <EntryTags tags={field.value} isEditing={isEditing} onChange={field.onChange} />
            )}
          />
        </Box>
      </Box>
    </Flex>
  );
};
