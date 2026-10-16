import { act, renderHook } from '@testing-library/react-native';
import {
  COMMENT_MAX_LENGTH,
  toUpdateFeedbackBody,
  useFeedbackForm,
  validateFeedbackForm,
} from './useFeedbackForm';
import * as feedbackApi from '../../services/api/feedbackApi';
import type { FeedbackEntity } from '../../types/feedback/form';

jest.mock('../../services/api/feedbackApi');

const SUBMITTED: FeedbackEntity = {
  id: 'feedback-1',
  releaseId: 'release-1',
  userId: 'user-1',
  rating: 4,
  comment: 'Buenísimo',
  willPlay: true,
  supported: true,
  trackStats: [],
};

const COMPLETE_VALUES = {
  rating: 4,
  comment: 'Buenísimo',
  willPlay: true,
  supported: false,
};

describe('validateFeedbackForm', () => {
  it('no marca errores con los cuatro campos contestados', () => {
    expect(validateFeedbackForm(COMPLETE_VALUES)).toEqual({});
  });

  it('exige calificación entre 1 y 5', () => {
    expect(validateFeedbackForm({ ...COMPLETE_VALUES, rating: null }).rating).toBeDefined();
    expect(validateFeedbackForm({ ...COMPLETE_VALUES, rating: 0 }).rating).toBeDefined();
    expect(validateFeedbackForm({ ...COMPLETE_VALUES, rating: 6 }).rating).toBeDefined();
    expect(validateFeedbackForm({ ...COMPLETE_VALUES, rating: 4.5 }).rating).toBeDefined();
    expect(validateFeedbackForm({ ...COMPLETE_VALUES, rating: 4 }).rating).toBeUndefined();
  });

  it('exige elegir sí o no en intention de reproducción y soporte', () => {
    const errors = validateFeedbackForm({ ...COMPLETE_VALUES, willPlay: null, supported: null });

    expect(errors.willPlay).toBeDefined();
    expect(errors.supported).toBeDefined();
  });

  it('permite el comentario vacío pero no uno larguísimo', () => {
    expect(validateFeedbackForm({ ...COMPLETE_VALUES, comment: '' }).comment).toBeUndefined();
    expect(
      validateFeedbackForm({ ...COMPLETE_VALUES, comment: 'x'.repeat(COMMENT_MAX_LENGTH + 1) }).comment,
    ).toBeDefined();
  });
});

describe('toUpdateFeedbackBody', () => {
  it('manda el comentario vacío como null y respeta los booleanos', () => {
    expect(toUpdateFeedbackBody({ ...COMPLETE_VALUES, comment: '   ' })).toEqual({
      rating: 4,
      comment: null,
      willPlay: true,
      supported: false,
    });
  });

  it('hace trim del comentario antes de mandarlo', () => {
    expect(toUpdateFeedbackBody({ ...COMPLETE_VALUES, comment: '  me gustó  ' }).comment).toBe('me gustó');
  });
});

describe('useFeedbackForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(feedbackApi, 'submitFeedback').mockResolvedValue(SUBMITTED);
  });

  it('no muestra los errores hasta el primer intento de envío', async () => {
    const { result } = await renderHook(() => useFeedbackForm());

    expect(result.current.errors).toEqual({});

    await act(async () => {
      await result.current.submit('release-1', 'feedback-1');
    });

    expect(result.current.errors.rating).toBeDefined();
    expect(feedbackApi.submitFeedback).not.toHaveBeenCalled();
  });

  it('envía el body del UpdateFeedbackDto cuando todo es válido', async () => {
    const { result } = await renderHook(() => useFeedbackForm());

    await act(async () => {
      result.current.setRating(5);
      result.current.setComment('muy bueno');
      result.current.setWillPlay(true);
      result.current.setSupported(true);
    });

    await act(async () => {
      await result.current.submit('release-1', 'feedback-1');
    });

    expect(feedbackApi.submitFeedback).toHaveBeenCalledWith('release-1', 'feedback-1', {
      rating: 5,
      comment: 'muy bueno',
      willPlay: true,
      supported: true,
    });
    expect(result.current.submitted).toEqual(SUBMITTED);
    expect(result.current.error).toBeNull();
  });

  it('limpia el error de un campo en cuanto el usuario lo corrige', async () => {
    const { result } = await renderHook(() => useFeedbackForm());

    await act(async () => {
      await result.current.submit('release-1', 'feedback-1');
    });
    expect(result.current.errors.rating).toBeDefined();

    await act(async () => {
      result.current.setRating(3);
    });

    expect(result.current.errors.rating).toBeUndefined();
  });

  it('expone el error del servidor sin marcar el formulario como enviado', async () => {
    jest.spyOn(feedbackApi, 'submitFeedback').mockRejectedValue(new Error('No se pudo enviar el feedback'));

    const { result } = await renderHook(() => useFeedbackForm());

    await act(async () => {
      result.current.setRating(3);
      result.current.setWillPlay(false);
      result.current.setSupported(false);
    });

    await act(async () => {
      await result.current.submit('release-1', 'feedback-1');
    });

    expect(result.current.error).toBe('No se pudo enviar el feedback');
    expect(result.current.submitted).toBeNull();
  });
});
