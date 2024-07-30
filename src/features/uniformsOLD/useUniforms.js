import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getUniforms,
  getUniform,
  // updateUniformApi,
  createEditUniform,
  deleteUniform as deleteUniformApi,
  getUniformJerseys,
  getUniformJersey,
  createEditUniformJersey,
  deleteUniformJersey as deleteUniformJerseyApi,
  getUniformSeasons,
  getUniformSeason,
  createEditUniformSeason,
  deleteUniformSeason as deleteUniformSeasonApi,
  getUniformSeasonPlayers,
  getUniformSeasonPlayer,
  createEditUniformSeasonPlayers,
  deleteUniformSeasonPlayers as deleteUniformSeasonPlayersApi,
} from '../../services/apiUniforms';
import { toast } from 'react-hot-toast';

export function useUniforms() {
  const {
    isLoading: isLoadingUniforms,
    data: uniforms,
    error,
  } = useQuery({ queryKey: ['uniforms'], queryFn: getUniforms });

  return { isLoadingUniforms, error, uniforms };
}

export function useUniform(uniformId) {
  const {
    setUniform,
    isLoading: isLoadingUniform,
    data: uniform,
    error,
  } = useQuery({
    queryKey: ['uniform'],
    queryFn: () => (uniformId ? getUniform(uniformId) : null),
  });
  return { isLoadingUniform, error, uniform, setUniform };
}

export function useUpdateUniform() {
  const queryClient = useQueryClient();

  const { mutate: updateUniform, isLoading: isUpdating } = useMutation({
    mutationFn: ({ newUniformData, id }) =>
      createEditUniform(newUniformData, id),
    onSuccess: () => {
      toast.success('New Uniform successfully edited');
      queryClient.invalidateQueries({ queries: ['uniforms'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdating, updateUniform };
}

export function useCreateUniform() {
  const queryClient = useQueryClient();
  const { mutate: createUniform, isLoading: isCreating } = useMutation({
    mutationFn: createEditUniform,
    onSuccess: () => {
      toast.success('New Uniform successfully created');
      queryClient.invalidateQueries({ queries: ['uniforms'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { createUniform, isCreating };
}

export function useDeleteUniform() {
  const queryClient = useQueryClient(); //from App
  const { isLoading: isDeleting, mutate: deleteUniform } = useMutation({
    mutationFn: deleteUniformApi,
    onSuccess: () => {
      toast.success(`Uniform  successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['uniforms'] });
    },

    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteUniform };
}

export function useUniformJerseys() {
  const {
    isLoading: isLoadingUniformJerseys,
    data: uniformJerseys,
    error,
  } = useQuery({ queryKey: ['uniformJerseys'], queryFn: getUniformJerseys });

  return { isLoadingUniformJerseys, error, uniformJerseys };
}

export function useUniformJersey(uniformId) {
  const {
    setUniformJersey,
    isLoading: isLoadingUniformJersey,
    data: uniformJersey,
    error,
  } = useQuery({
    queryKey: ['uniformJersey'],
    queryFn: () => (uniformId ? getUniformJersey(uniformId) : null),
  });
  return { isLoadingUniformJersey, error, uniformJersey, setUniformJersey };
}

export function useUpdateUniformJersey() {
  const queryClient = useQueryClient();

  const { mutate: updateUniformJersey, isLoading: isUpdatingJersey } =
    useMutation({
      mutationFn: ({ newUniformJerseyData, id }) =>
        createEditUniformJersey(newUniformJerseyData, id),
      onSuccess: () => {
        toast.success('New UniformJersey successfully edited');
        queryClient.invalidateQueries({ queries: ['uniformJerseys'] });
      },
      onError: (err) => toast.error(err.message),
    });
  return { isUpdatingJersey, updateUniformJersey };
}

export function useCreateUniformJersey() {
  const queryClient = useQueryClient();
  const { mutate: createUniformJersey, isLoading: isCreating } = useMutation({
    mutationFn: createEditUniformJersey,
    onSuccess: () => {
      toast.success('New UniformJersey successfully created');
      queryClient.invalidateQueries({ queries: ['uniformJerseys'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { createUniformJersey, isCreating };
}

export function useDeleteUniformJersey() {
  const queryClient = useQueryClient(); //from App
  const { isLoading: isDeleting, mutate: deleteUniformJersey } = useMutation({
    mutationFn: deleteUniformJerseyApi,
    onSuccess: () => {
      toast.success(`UniformJersey  successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['uniformJerseys'] });
    },

    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteUniformJersey };
}

export function useUniformSeasons() {
  const {
    isLoading: isLoadingUniformSeasons,
    data: uniformSeasons,
    error,
  } = useQuery({ queryKey: ['uniformSeasons'], queryFn: getUniformSeasons });

  return { isLoadingUniformSeasons, error, uniformSeasons };
}

export function useUniformSeason(uniformId) {
  const {
    setUniformSeason,
    isLoading: isLoadingUniformSeason,
    data: uniformSeason,
    error,
  } = useQuery({
    queryKey: ['uniformSeason'],
    queryFn: () => (uniformId ? getUniformSeason(uniformId) : null),
  });
  return { isLoadingUniformSeason, error, uniformSeason, setUniformSeason };
}

export function useUpdateUniformSeason() {
  const queryClient = useQueryClient();

  const { mutate: updateUniformSeason, isLoading: isUpdatingJersey } =
    useMutation({
      mutationFn: ({ newUniformSeasonData, id }) =>
        createEditUniformSeason(newUniformSeasonData, id),
      onSuccess: () => {
        toast.success('New UniformSeason successfully edited');
        queryClient.invalidateQueries({ queries: ['uniformSeasons'] });
      },
      onError: (err) => toast.error(err.message),
    });
  return { isUpdatingJersey, updateUniformSeason };
}

export function useCreateUniformSeason() {
  const queryClient = useQueryClient();
  const { mutate: createUniformSeason, isLoading: isCreating } = useMutation({
    mutationFn: createEditUniformSeason,
    onSuccess: () => {
      toast.success('New UniformSeason successfully created');
      queryClient.invalidateQueries({ queries: ['uniformSeasons'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { createUniformSeason, isCreating };
}

export function useDeleteUniformSeason() {
  const queryClient = useQueryClient(); //from App
  const { isLoading: isDeleting, mutate: deleteUniformSeason } = useMutation({
    mutationFn: deleteUniformSeasonApi,
    onSuccess: () => {
      toast.success(`UniformSeason  successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ['uniformSeasons'] });
    },

    onError: (err) => toast.error(err.message),
  });
  return { isDeleting, deleteUniformSeason };
}

export function useUniformSeasonPlayers() {
  const {
    isLoading: isLoadingUniformSeasonPlayers,
    data: uniformSeasonPlayers,
    error,
  } = useQuery({
    queryKey: ['uniformSeasonPlayers'],
    queryFn: getUniformSeasonPlayers,
  });

  return { isLoadingUniformSeasonPlayers, error, uniformSeasonPlayers };
}

export function useUniformSeasonPlayer(uniformId) {
  const {
    setUniformSeasonPlayer,
    isLoading: isLoadingUniformSeasonPlayer,
    data: uniformSeasonPlayer,
    error,
  } = useQuery({
    queryKey: ['uniformSeasonPlayer'],
    queryFn: () => (uniformId ? getUniformSeasonPlayer(uniformId) : null),
  });
  return {
    isLoadingUniformSeasonPlayer,
    error,
    uniformSeasonPlayer,
    setUniformSeasonPlayer,
  };
}

export function useUpdateUniformSeasonPlayers() {
  const queryClient = useQueryClient();

  const {
    mutate: updateUniformSeasonPlayers,
    isLoading: isUpdatingUniformSeasonPlayers,
  } = useMutation({
    mutationFn: ({ newUniformSeasonPlayers, id }) =>
      createEditUniformSeasonPlayers(newUniformSeasonPlayers, id),
    onSuccess: () => {
      toast.success('New UniformSeasonPlayers successfully edited');
      queryClient.invalidateQueries({ queries: ['uniformSeasonPlayers'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { isUpdatingUniformSeasonPlayers, updateUniformSeasonPlayers };
}

export function useCreateUniformSeasonPlayers() {
  const queryClient = useQueryClient();
  const { mutate: createUniformSeasonPlayers, isLoading: isCreating } =
    useMutation({
      mutationFn: createEditUniformSeasonPlayers,
      onSuccess: () => {
        toast.success('New UniformSeasonPlayers successfully created');
        queryClient.invalidateQueries({ queries: ['uniformSeasonPlayers'] });
      },
      onError: (err) => toast.error(err.message),
    });
  return { createUniformSeasonPlayers, isCreating };
}

export function useDeleteUniformSeasonPlayers() {
  const queryClient = useQueryClient(); //from App
  const { isLoading: isDeleting, mutate: deleteUniformSeasonPlayers } =
    useMutation({
      mutationFn: deleteUniformSeasonPlayersApi,
      onSuccess: () => {
        toast.success(`UniformSeasonPlayers  successfully deleted`);
        queryClient.invalidateQueries({ queryKey: ['uniformSeasonPlayers'] });
      },

      onError: (err) => toast.error(err.message),
    });
  return { isDeleting, deleteUniformSeasonPlayers };
}
