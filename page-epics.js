import { ofType } from 'redux-observable';
import { from, of, concat } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { EditorState, ContentState, convertFromHTML, convertFromRaw } from 'draft-js';
import api from '../utils/api';
import {
    page,
    createPage,
    deletePage,
    editPage,
    editorState,
    toggleMorePanel,
    getDataForQrCode
} from 'actions/page';
import {
    PAGE_CREATE_REQUEST,
    PAGE_DELETE_REQUEST,
    PAGE_EDIT_REQUEST,
    PAGE_REQUEST,
    PAGE_QR_CODE_REQUEST,
    PAGE_QR_CODE_SUCCESS,
    PAGE_QR_CODE_ERROR
} from 'constants/actionTypes';
import { oneModule } from 'actions/module';
import { setNotes } from "actions/note";
import { showNotification } from "actions/common";
import { notifications } from "constants/config";
const { pageCreateError, loadPageError } = notifications;


const createPageEpic = action$ =>
    action$.pipe(
        ofType(PAGE_CREATE_REQUEST),
        switchMap(({courseId, moduleId, data, query}) => 
          from(api.Pages.create(courseId, moduleId, data, query))
            .pipe(
              switchMap(data => 
                from(api.Modules.getOne(courseId, moduleId))
                .pipe(
                    switchMap(data => 
                        concat(
                                of(oneModule.success(data)),
                                of(page.request(courseId, moduleId, data.last_opened || data.pages[0].sort_index))
                            )
                    )
                )
              )
            )
        ),
        catchError(err => 
          concat(
              of(createPage.failure(err)),
              of(showNotification({ ...pageCreateError, contentText: err.error }))
          )
        )
    );

const getPageEpic = action$ =>
    action$.pipe(
        ofType(PAGE_REQUEST),
        switchMap(({ courseId, moduleId, pageNum }) =>
            from(api.Pages.getOne(courseId, moduleId, pageNum))
                .pipe(
                    switchMap(data => {
                        const observers = [
                            of(page.success(data)),
                            of(setNotes(data.notes
                                .concat(data.image_notes, data.file_notes, data.url_notes)
                                    .sort((a,b) => (a.created_datetime > b.created_datetime) ? -1 : ((b.created_datetime > a.created_datetime) ? 1 : 0))
                                )),
                        ];
                        if (data.pagetype === 'custom') {
                            let editorStateObj = null;
                            try {
                                // This is new save content parser
                                const parsedJson = JSON.parse(data.custom_content);
                                editorStateObj = EditorState.createWithContent(
                                    convertFromRaw(parsedJson)
                                );
                            } catch (err) {
                                // This code used for support previously html content
                                const blocksFromHTML = convertFromHTML(data.custom_content);
                                const state = ContentState.createFromBlockArray(
                                    blocksFromHTML.contentBlocks,
                                    blocksFromHTML.entityMap
                                  );
                                editorStateObj = EditorState.createWithContent(
                                    state
                                );
                            }
                            observers.push(
                                of(editorState(
                                    editorStateObj
                                ))
                            );
                        }
                        return concat.apply(this, observers)
                    }),
                    catchError(err =>
                        concat(
                            of(page.failure(err)),
                            of(showNotification(loadPageError))
                        )
                    )
                )
        )
    );

const editPageEpic = action$ =>
    action$.pipe(
        ofType(PAGE_EDIT_REQUEST),
        switchMap(({courseId, moduleId, pageNum, data}) => 
          from(api.Pages.edit(courseId, moduleId, pageNum, data))
            .pipe(
              switchMap(data =>
                concat(
                    of(editPage.success(data)),
                    of(toggleMorePanel())
                )
              ),
              catchError(err => of(editPage.failure(err)))
            )
        )
    );

const getDataForQrCodeEpic = action$ =>
    action$.pipe(
        ofType(PAGE_QR_CODE_REQUEST),
        switchMap(({userId, pageId}) => 
          from(api.Pages.getDataForQrCode(userId, pageId))
            .pipe(
              switchMap(data =>
                concat(
                    of(getDataForQrCode.success(data))
                )
              ),
              catchError(err => of(getDataForQrCode.failure(err)))
            )
        )
    );


const deletePageEpic = action$ =>
    action$.pipe(
        ofType(PAGE_DELETE_REQUEST),
        switchMap(({courseId, moduleId, pageNum}) => 
            from(api.Pages.delete(courseId, moduleId, pageNum))
                .pipe(
                    switchMap(() =>
                        concat(
                            of(deletePage.success(pageNum)),
                            of(oneModule.request(courseId, moduleId)),
                            of(toggleMorePanel())
                        )
                    ),
                    catchError(err =>
                        of(deletePage.failure(err))
                    )
                )
        )
    );

export default [
  createPageEpic,
  deletePageEpic,
  editPageEpic,
  getPageEpic,
  getDataForQrCodeEpic
];

