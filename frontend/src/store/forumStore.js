import { create } from 'zustand';
import { apiFetch } from '../utils/api';

export const useForumStore = create((set) => ({
  ideas: [],
  isLoading: false,

  fetchIdeas: async () => {
    set({ isLoading: true });
    try {
      const data = await apiFetch('/ideas');
      set({ ideas: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  lockIdea: async (ideaId, teamData) => {
    try {
      const updatedIdea = await apiFetch('/register-team', {
        method: 'POST',
        body: JSON.stringify({
          idea_id: ideaId,
          team_name: teamData.teamName,
          members: teamData.members,
        }),
      });
      set((state) => ({
        ideas: state.ideas.map((idea) =>
          idea.id === ideaId ? updatedIdea : idea
        ),
      }));
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  },
}));
