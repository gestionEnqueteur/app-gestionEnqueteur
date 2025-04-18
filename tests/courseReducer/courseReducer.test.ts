import courseReducer, { ActionCourse } from '../../reducer/courseReducer'
import CourseInterface from '../../models/CourseInterface'
import { StatusEnum } from '../../models/enum/index'

describe('courseReducer', () => {
  const baseCourse: CourseInterface = {
    id: 1,
    mission: 'Mission 1',
    pds: 'PDS 1',
    vac: 'VAC 1',
    status: StatusEnum.DRAFT,
    isSynchro: false,
    updatedAt: new Date().toISOString(),
  }

  it('should add a course to empty state', () => {
    const action: ActionCourse = { type: 'add', course: baseCourse }
    const result = courseReducer([], action)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it('should not add duplicate course', () => {
    const action: ActionCourse = { type: 'add', course: baseCourse }
    const result = courseReducer([baseCourse], action)
    expect(result).toHaveLength(1)
  })

  it('should delete a course by id', () => {
    const state = [baseCourse]
    const action: ActionCourse = { type: 'delete', course: baseCourse }
    const result = courseReducer(state, action)
    expect(result).toHaveLength(0)
  })

  it('should update a course and set isSynchro to false', () => {
    const updatedCourse = { ...baseCourse, mission: 'Updated Mission' }
    const action: ActionCourse = { type: 'update', course: updatedCourse }
    const result = courseReducer([baseCourse], action)
    expect(result[0].mission).toBe('Updated Mission')
    expect(result[0].isSynchro).toBe(false)
  })

  it('should mark a course as synchronized', () => {
    const state = [{ ...baseCourse, isSynchro: false }]
    const action: ActionCourse = { type: 'synchro', coursesId: [1] }
    const result = courseReducer(state, action)
    expect(result[0].isSynchro).toBe(true)
  })

  it('should reset state to empty array', () => {
    const state = [baseCourse]
    const action: ActionCourse = { type: 'reset' }
    const result = courseReducer(state, action)
    expect(result).toEqual([])
  })
})

