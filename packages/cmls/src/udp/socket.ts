import { Socket, RemoteInfo } from 'dgram'
import { Observable } from 'rxjs'

export function observableFromSocket<T>(
  map: (message: Buffer, remoteInfo?: RemoteInfo) => T,
  socket?: Socket,
): Observable<T> {
  return Observable.create(observer => {
    socket.on('message', (message: Buffer, remoteInfo: RemoteInfo) => {
      observer.next(map(message, remoteInfo))
    })
    socket.on('error', err => {
      observer.error(err)
    })
    socket.on('close', () => {
      observer.complete()
    })
  })
}

